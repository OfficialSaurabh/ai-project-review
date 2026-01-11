// app/components/repo-list.tsx
"use client";

import Link from "next/link";
import Loader from "./loader";
import { Badge } from "@/components/ui/badge"
import { IoIosStarOutline } from "react-icons/io";
import { GoRepoForked } from "react-icons/go";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
  reposLoading?: boolean;
  owner: {
    login: string;
  };
}

export default function RepoList({
  repos,
  reposLoading,
}: Readonly<{ repos: Repo[]; reposLoading?: boolean }>) {
    if (reposLoading) {
    return <Loader />
    ;
  }

  if (!repos?.length) return <p>No repositories found.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 items-stretch ">
      {repos.map((repo) => (
        <Link
          key={repo.id}
          href={`/repos/${encodeURIComponent(repo.owner.login)}/${encodeURIComponent(repo.name)}`}
          className="block border rounded-lg transition h-full"
        >
          <div className="glass-card p-6 rounded-xl hover:border-primary/50 transition-all  group h-full flex flex-col" >

            <h4 className="text-lg font-semibold font-mono mb-2 truncate group-hover:text-primary transition-colors">
              {repo.name}
            </h4>
            {repo.description && (
              <p className="text-sm text-muted-foreground mt-1 flex-grow">
                {repo.description}
              </p>
            )}
            <div className="text-xs text-muted-foreground mt-2 flex gap-4 ">
              <Badge variant="outline">{repo.language}</Badge>
              <span className="flex items-center gap-x-1 "><IoIosStarOutline /> {repo.stargazers_count}</span>
              <span className="flex items-center gap-x-1 "><GoRepoForked /> {repo.forks_count}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
