// app/repos/[owner]/[name]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import NavBar from "@/app/components/nav-bar";
import RepoFiles from "@/app/components/repo-files";
import Loader from "@/app/components/loader";
import { toast } from "sonner"


interface FileItem {
  path: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
}

export default function RepoFilesPage() {
  const params = useParams() as { owner?: string; name?: string };
  const owner = params.owner;
  const name = params.name;
  const { data: session } = useSession();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
 const provider = session?.provider;


  useEffect(() => {
    if (!session?.accessToken) return;
    if (!owner || !name) {
      toast.error("Missing owner or name from URL");
      console.error("Missing owner or name from URL:", { owner, name });
      return;
    }

    // const fetchFiles = async () => {
    //   setIsLoading(true);
    //   try {
    //     // 1) Get repo info for default_branch
    //     const repoRes = await fetch(
    //       `https://api.github.com/repos/${owner}/${name}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${session.accessToken}`,
    //         },
    //       }
    //     );

    //     if (!repoRes.ok) {
    //       toast.error("Failed to fetch repo info");
    //       console.error("Repo info status:", repoRes.status);
    //       throw new Error("Failed to fetch repo info");
    //     }

    //     const repoData = await repoRes.json();
    //     const defaultBranch = repoData.default_branch;

    //     // 2) Get tree
    //     const treeRes = await fetch(
    //       `https://api.github.com/repos/${owner}/${name}/git/trees/${defaultBranch}?recursive=1`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${session.accessToken}`,
    //         },
    //       }
    //     );

    //     if (!treeRes.ok) {
    //       console.error("Tree status:", treeRes.status);
    //       throw new Error("Failed to fetch repository files");
    //     }

    //     const treeData = await treeRes.json();
    //     console.log("Fetched files:", treeData);
    //     setFiles(treeData.tree || []);
    //   } catch (err) {
    //     console.error(err);
    //     setFiles([]);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
const fetchFiles = async () => {
  setIsLoading(true);
  try {
    if (provider === "github") {
      const repoRes = await fetch(
        `https://api.github.com/repos/${owner}/${name}`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      if (!repoRes.ok) throw new Error("Failed to fetch GitHub repo");

      const repoData = await repoRes.json();
      const defaultBranch = repoData.default_branch;

      const treeRes = await fetch(
        `https://api.github.com/repos/${owner}/${name}/git/trees/${defaultBranch}?recursive=1`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      if (!treeRes.ok) throw new Error("Failed to fetch GitHub tree");

      const treeData = await treeRes.json();
      setFiles(treeData.tree || []);
    }

    else if (provider === "bitbucket") {
      // 1. Get repo info
      const repoRes = await fetch(
        `https://api.bitbucket.org/2.0/repositories/${owner}/${name}`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      if (!repoRes.ok) throw new Error("Failed to fetch Bitbucket repo");

      const repoData = await repoRes.json();
      const defaultBranch = repoData.mainbranch.name;

      // 2. Get file tree
      const treeRes = await fetch(
        `https://api.bitbucket.org/2.0/repositories/${owner}/${name}/src/${defaultBranch}/`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      if (!treeRes.ok) throw new Error("Failed to fetch Bitbucket files");

      const treeData = await treeRes.json();

      const normalized = treeData.values.map((f: any) => ({
        path: f.path,
        type: f.type === "commit_file" ? "blob" : "tree",
        sha: f.commit.hash,
      }));

      setFiles(normalized);
    }

    else {
      throw new Error("Unknown provider");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch repository files");
    setFiles([]);
  } finally {
    setIsLoading(false);
  }
};

    fetchFiles();
  }, [owner, name, session?.accessToken]);

  if (!owner || !name) {
    // if this still hits with correct URL, something is seriously wrong
    return (
      <>
        <NavBar />
        <div className="min-h-screen p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-sm border rounded px-3 py-1 hover:bg-accent"
            >
              ← Back to repositories
            </button>
            <p className="text-red-500 mt-4 text-sm">
              Could not read owner/repo from URL.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-4 ">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm glass-card p-6 hover:border-primary/50 transition-all group border glass-card rounded px-3 py-1"
            >
              ← Back to repositories
            </button>
            {/* <h1 className="text-2xl font-semibold">
              {owner}/{name}
            </h1> */}
          </div>

          {isLoading ? (
            <Loader />
          ) : (
            <RepoFiles files={files} repoName={name} owner={owner} />
          )}
        </div>
      </div>
    </>
  );
}
