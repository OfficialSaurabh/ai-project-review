// import { GitBranch, Star, GitFork, FileCode } from "lucide-react";
import { IoGitBranchOutline } from "react-icons/io5";
import { IoIosStarOutline } from "react-icons/io";
// import { PiGitForkLight } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Repo {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
}

interface RepoListProps {
  repos: Repo[];
}

export const RepoList = ({ repos }: RepoListProps) => {
  if (repos.length === 0) {
    return (
      <div className="glass-card p-12 rounded-xl text-center">
        {/* <FileCode className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" /> */}
        <p className="text-muted-foreground text-lg">No repositories found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <IoGitBranchOutline className="w-5 h-5 text-primary" />
        Repositories ({repos.length})
      </h3>
      <div className="grid gap-4">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="glass-card p-6 rounded-xl hover:border-primary/50 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold font-mono mb-2 truncate group-hover:text-primary transition-colors">
                  {repo.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {repo.description || "No description provided"}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {repo.language && (
                    <Badge variant="secondary" className="font-mono">
                      {repo.language}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <IoIosStarOutline className="w-4 h-4" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* <GitFork className="w-4 h-4" /> */}
                    <span>{repo.forks_count}</span>
                  </div>
                </div>
              </div>
              <Button
                // onClick={() => onSelectRepo(repo)}
                variant="outline"
                className="border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all shrink-0"
              >
                Review Project
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepoList;