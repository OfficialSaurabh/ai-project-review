// app/components/repo-list.tsx
"use client";

import Link from "next/link";

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

export default function RepoList({ repos }: { repos: Repo[] }) {
  if (!repos?.length) return <p>No repositories found.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 ">
      {repos.map((repo) => (
        <Link
          key={repo.id}
          href={`/repos/${encodeURIComponent(repo.owner.login)}/${encodeURIComponent(repo.name)}`}
          className="block border rounded-lg transition"
        >
          <div className="glass-card p-6 rounded-xl hover:border-primary/50 transition-all group" >

          <h4 className="text-lg font-semibold font-mono mb-2 truncate group-hover:text-primary transition-colors">
                  {repo.name}
                </h4>
          {repo.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {repo.description}
            </p>
          )}
          <div className="text-xs text-muted-foreground mt-2 flex gap-4 ">
            <span>{repo.language}</span>
            <span>★ {repo.stargazers_count}</span>
            <span>⑂ {repo.forks_count}</span>
          </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
