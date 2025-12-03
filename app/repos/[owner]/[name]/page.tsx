// app/repos/[owner]/[name]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import NavBar from "@/app/components/nav-bar";
import RepoFiles from "@/app/components/repo-files";

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

  console.log("useParams in RepoFilesPage:", params);

  const { data: session } = useSession();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!session?.accessToken) return;
    if (!owner || !name) {
      console.error("Missing owner or name from URL:", { owner, name });
      return;
    }

    const fetchFiles = async () => {
      setIsLoading(true);
      try {
        // 1) Get repo info for default_branch
        const repoRes = await fetch(
          `https://api.github.com/repos/${owner}/${name}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!repoRes.ok) {
          console.error("Repo info status:", repoRes.status);
          throw new Error("Failed to fetch repo info");
        }

        const repoData = await repoRes.json();
        const defaultBranch = repoData.default_branch;

        // 2) Get tree
        const treeRes = await fetch(
          `https://api.github.com/repos/${owner}/${name}/git/trees/${defaultBranch}?recursive=1`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!treeRes.ok) {
          console.error("Tree status:", treeRes.status);
          throw new Error("Failed to fetch repository files");
        }

        const treeData = await treeRes.json();
        console.log("Fetched files:", treeData);
        setFiles(treeData.tree || []);
      } catch (err) {
        console.error(err);
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
            <p>Loading files...</p>
          ) : (
            <RepoFiles files={files} repoName={name} owner={owner} />
          )}
        </div>
      </div>
    </>
  );
}
