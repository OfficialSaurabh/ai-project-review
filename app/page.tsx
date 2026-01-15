"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import NavBar from "./components/nav-bar";
import RepoList from "./components/repo-list";
import Hero from "./components/hero";
import LocalFileReview from "./components/localFileReview";
import { Button } from "@headlessui/react";
import { toast } from "sonner"


interface Repo {
  id: number;
  name: string;          // display
  slug?: string;        // bitbucket
  full_name: string;
  description?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  default_branch?: string;
  owner: {
    login: string;
  };
}



export default function Home() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [reviewLocalFile, setReviewLocalFile] = useState(false);
  const [search, setSearch] = useState("");


  useEffect(() => {
    if (!session?.accessToken || !session?.provider) return;

    setReposLoading(true);

    const fetchRepos = async () => {
      try {
        let url = "";

        if (session.provider === "github") {
          url = "https://api.github.com/user/repos?sort=updated&direction=desc";
        } else if (session.provider === "bitbucket") {
          url = "https://api.bitbucket.org/2.0/repositories?role=member&sort=-updated_on";
        } else {
          throw new Error("Unsupported provider");
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        const data = await res.json();

        if (session.provider === "github") {
          setRepos(data);
        } else {
          // Bitbucket wraps results in `values`, and fields differ
          const normalized = data.values.map((r: any) => ({
            id: r.uuid || r.full_slug,
            name: r.name,                 // display
            slug: r.slug,                 // URL
            full_name: r.full_slug || `${r.workspace.slug}/${r.slug}`,
            displayName: r.name,
            description: r.description,
            language: r.language ?? "N/A",
            forks_count: r.fork_policy ? 1 : 0, // placeholder or fetch separately
            default_branch: r.mainbranch?.name,
            owner: {
              login: r.workspace.slug,
            },
          }));



          setRepos(normalized);
        }
      } catch (err) {
        toast.error("Failed to fetch repos");
        console.error("Failed to fetch repos", err);
      } finally {
        setReposLoading(false);
      }
    };

    fetchRepos();
  }, [session]);

  const q = search.toLowerCase();

  const filteredRepos = repos.filter((r) =>
    (r.name || "").toLowerCase().includes(q) ||
    (r.full_name || "").toLowerCase().includes(q) ||
    (r.description || "").toLowerCase().includes(q)
  );



  return (
    <>
      <NavBar />
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
              AI Project Analyzer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Analyze code quality, structure, and documentation with detailed insights and actionable suggestions
            </p>
          </div>
          {session ? (
            <>
              <div className=" flex justify-end ">
                <button
                  type="button"
                  onClick={() => setReviewLocalFile(true)}
                  className="text-sm border rounded px-3 py-1 hover:border-accent  transition-colors flex items-center gap-2"
                >
                  {/* <FiGithub className="h-4 w-4" /> */}
                  Review Local File
                </button>
              </div>
              {reviewLocalFile && (

                <LocalFileReview setReviewLocalFile={setReviewLocalFile} />
              )}
              <div className="mb-4 max-w-md">
                <input
                  type="text"
                  placeholder="Find a repository…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>

              <RepoList
                repos={filteredRepos}
                reposLoading={reposLoading}
              />

            </>
          ) : (
            <Hero />
          )}
        </div>
      </div>
    </>
  );
}
