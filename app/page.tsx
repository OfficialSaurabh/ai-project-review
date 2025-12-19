"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import NavBar from "./components/nav-bar";
import RepoList from "./components/repo-list";
import Hero from "./components/hero";
import LocalFileReview from "./components/localFileReview";
import { Button } from "@headlessui/react";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
  owner: {
    login: string;
  };
}
export default function Home() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [reviewLocalFile, setReviewLocalFile] = useState(false);

  useEffect(() => {
    if (!session?.accessToken) return;

    setReposLoading(true);

    const fetchRepos = async () => {
      try {
        const res = await fetch("https://api.github.com/user/repos?sort=updated&direction=desc", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        const data = await res.json();
        setRepos(data);
      } catch (err) {
        console.error("Failed to fetch repos", err);
      } finally {
        setReposLoading(false);
      }
    };

    fetchRepos();
  }, [session]);


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

              <RepoList
                repos={repos}
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
