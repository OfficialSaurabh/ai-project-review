"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import NavBar from "./components/nav-bar";
import RepoList  from "./components/repo-list";
import RepoFiles from "./components/repo-files";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
}

interface FileItem {
  path: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
}

export default function Home() {
 const { data: session } = useSession();
 const [repos, setRepos] = useState([]);
  console.log("Repos:", repos);
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.accessToken) {
      fetch("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setRepos(data));
    }
  }, [session]);

    const handleSelectRepo = async (repo: Repo) => {
    setSelectedRepo(repo);
    setSelectedFile(null);
    setShowFullAnalysis(false);
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo.full_name}/git/trees/${repo.default_branch}?recursive=1`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch repository files");
      }
      
      const data = await response.json();
      setFiles(data.tree || []);
      toast.success(`Loaded ${data.tree?.length || 0} files from ${repo.name}`);
    } catch (error) {
      toast.error("Failed to fetch repository files");
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
    <NavBar />
     <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
      {/* <LoginBtn /> */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
            AI Project Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analyze code quality, structure, and documentation with detailed insights and actionable suggestions
          </p>
        </div>
        {selectedRepo && (
          <RepoFiles
            files={files}
            repoName={selectedRepo.name}
          />
        )}
        {session ? (<RepoList repos={repos} onSelectRepo={handleSelectRepo}/>) : (<>Test</>)}
    </div>
     </div>
    </>
  );
}
