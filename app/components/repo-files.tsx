"use client";
import { CiFolderOn, CiFileOn } from "react-icons/ci";
import { GoChevronRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { AnalysisDashboard } from "./analysis-dashboard";
import Loader from "./loader";
import { useSession } from "next-auth/react";
import { toast } from "sonner"
import { BiGitBranch } from "react-icons/bi";
import { buildFileTree } from "../utils/buildFileTree";
import { FileTree } from "./file-tree"
import { fetchFileContent } from "../utils/fetchFileContent";
import { CodeViewer } from "./code-viewer";
import { getLanguage } from "../utils/getLanguage";



import { create } from "domain";
import { log } from "console";
import CodeSkeleton from "./code-skeleton";

interface FileItem {
  path: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
}

interface FileExplorerProps {
  files: FileItem[];
  repoName: string;
  owner: string;
  webhookUrl?: string;
}

interface AnalysisResponse {
  project: string;
  overallFileScore: number;
  metrics: {
    testCoverageEstimate: number;
    documentationScore: number;
    readability: number;
  };
  topIssues: any[];
  createdAt: string;
}

const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp", ".ico"];


export const FileExplorer = ({
  files,
  repoName,
  owner,
}: FileExplorerProps) => {
  const { data: session } = useSession();
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [reviewData, setReviewData] = useState<AnalysisResponse | null>(null);
  const [showFile, setShowFile] = useState(true);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [lastReviewedFile, setLastReviewedFile] = useState<string | null>(null);
  const [branches, setBranches] = useState<string[]>([]);
  const [fileLoading, setFileLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [branchFiles, setBranchFiles] = useState<FileItem[]>([]);




  const [fileList, setFileList] = useState<string[]>([]);
  console.log("files in FileExplorer:", fileList);



  const getFileIcon = (file: FileItem) => {
    if (file.type === "tree") {
      return <CiFolderOn className="w-4 h-4 text-primary" />;
    }
    return <CiFileOn className="w-4 h-4 text-muted-foreground" />;
  };

  const isImageFile = (path: string) => {
    return imageExtensions.some(ext => path.toLowerCase().endsWith(ext));
  };


  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  const fileTree = buildFileTree(
    branchFiles.map(f => f.path)
  );



  const getFileContent = async (path: string): Promise<void> => {
    if (!repoName) return;
    try {
      const res = await fetch(
        `https://api.github.com/repos/OfficialSaurabh/${repoName}/contents/${path}`
      );
      const file = await res.json();

      if (file && file.content) {
        const base64 = file.content.replace(/\n/g, "");
        const decoded = typeof atob === "function" ? atob(base64) : "";
        setSelectedFileContent(decoded);
      } else {
        setSelectedFileContent("// No content");
      }
    } catch (err) {
      console.error("Failed to load file content", err);
      setSelectedFileContent("// Error loading file");
    }
  };

  const webhookUrl = process.env.NEXT_PUBLIC_REVIEW_WEBHOOK;
  const normalizeReviewResponse = (data: any) => {
    return {
      project: data.project,
      overallFileScore:
        data.file?.overallFileScore ??
        data.overallProjectScore ??
        0,
      metrics: {
        testCoverageEstimate: data.file?.metrics?.testCoverageEstimate ?? 0,
        documentationScore: data.file?.metrics?.documentationScore ?? 0,
        readability: data.file?.metrics?.readability ?? 0,
      },
      topIssues: data.topIssues ?? [],
      createdAt: data.createdAt ?? new Date().toISOString(),
    };
  };
  const normalizeLastReviewResponse = (data: any, owner: string, repo: string) => {
    if (!data?.exists) {
      throw new Error("No stored review exists");
    }

    return {
      project: `${owner}/${repo}@main`,
      createdAt: data.createdAt,
      overallFileScore: data.fileScore ?? 0,
      metrics: {
        testCoverageEstimate: data.metrics?.testCoverageEstimate ?? 0,
        documentationScore: data.metrics?.documentationScore ?? 0,
        readability: data.metrics?.readability ?? 0,
      },
      topIssues: data.issues ?? [],
    };
  };

  const fetchBranches = async () => {
    if (!session?.provider) {
      toast.error("Provider missing from session");
      return;
    }
    const headers: Record<string, string> =
      session.provider === "github"
        ? {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/vnd.github+json",
        }
        : {
          Authorization: `Bearer ${session.accessToken}`,
        };

    try {
      let defaultBranch = "";

      if (session.provider === "github") {
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, { headers });
        const repoData = await repoRes.json();
        defaultBranch = repoData.default_branch;
      } else if (session.provider === "bitbucket") {
        const repoRes = await fetch(`https://api.bitbucket.org/2.0/repositories/${owner}/${repoName}`, { headers });
        const repoData = await repoRes.json();
        defaultBranch = repoData.mainbranch.name;
      }

      let url = "";

      if (session.provider === "github") {
        url = `https://api.github.com/repos/${owner}/${repoName}/branches`;
      } else if (session.provider === "bitbucket") {
        url = `https://api.bitbucket.org/2.0/repositories/${owner}/${repoName}/refs/branches`;
      } else {
        throw new Error("Unsupported provider");
      }

      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`Branch fetch failed: ${res.status}`);

      const data = await res.json();

      const branchNames =
        session.provider === "github"
          ? data.map((b: any) => b.name)
          : data.values.map((b: any) => b.name);

      setBranches(branchNames);

      // Set default only once, not hardcoded "main"
      setSelectedBranch(defaultBranch || branchNames[0]);
    } catch (err) {
      console.error("Failed to fetch branches", err);
    }
  };

  const fetchBranchTree = async () => {
    if (!session?.provider || !session?.accessToken) return;

    let url = "";
    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
    };

    if (session.provider === "github") {
      url = `https://api.github.com/repos/${owner}/${repoName}/git/trees/${selectedBranch}?recursive=1`;
      headers.Accept = "application/vnd.github+json";
    }

    if (session.provider === "bitbucket") {
      const encodedBranch = encodeURIComponent(selectedBranch);
      url = `https://api.bitbucket.org/2.0/repositories/${owner}/${repoName}/src/${encodedBranch}/`;

    }

    console.log("BB:", owner, repoName, selectedBranch);

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Tree fetch failed: ${res.status}`);

    const data = await res.json();

    if (session.provider === "github") {
      setBranchFiles(
        data.tree
          .filter((f: any) => f.type === "blob")
          .map((f: any) => ({
            path: f.path,
            type: "blob",
            sha: f.sha,
          }))
      );
    }

    if (session.provider === "bitbucket") {
      setBranchFiles(
        data.values
          .filter((f: any) => f.type === "commit_file")
          .map((f: any) => ({
            path: f.path,       // correct
            type: "blob",
            sha: f.path,       // Bitbucket does not expose blob SHA here
          }))
      );
    }
  };

  useEffect(() => {
    if (selectedBranch) {
      fetchBranchTree();
    }
  }, [selectedBranch]);



  const sendReviewRequest = async (payload: Record<string, any>) => {
    if (!webhookUrl) throw new Error("Missing env: NEXT_PUBLIC_REVIEW_WEBHOOK");

    setIsReviewLoading(true);

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

      const data = await res.json().catch(() => null);
      return normalizeReviewResponse(data);
    } finally {
      // Ensure loading always stops
      setIsReviewLoading(false);
    }
  };
  const normalizedFileList = fileList.map(p =>
    p.startsWith("/") ? p.slice(1) : p
  );

  const handleReviewFile = async (path: string) => {
    if (!session?.provider || !session?.accessToken) {
      toast.error("Authentication token missing");
      return;
    }
    const filename = path.startsWith("/") ? path : `/${path}`;

    const payload = {
      provider: session.provider,          // github | bitbucket
      accessToken: session.accessToken,
      action: "file",
      owner,
      repo: repoName,
      ref: selectedBranch,
      filename,
    };

    try {
      const mappedResponse = await sendReviewRequest(payload);

      setReviewData(mappedResponse);
      setLastReviewedFile(filename)
      setIsReviewOpen(true);
      setShowFile(false);
    } catch (err) {
      console.error("Error reviewing file:", err);
      toast.error("AI review service failed");
      setReviewData(null);
      setIsReviewOpen(false);
      setShowFile(true);
    }
  };

  const fetchLastReview = async (path?: string) => {
    if (!session?.provider) {
      toast.error("Provider missing from session");
      return;
    }

    console.log("Fetching last review for file:", path);
    setIsReviewLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      const commonParams = new URLSearchParams({
        provider: session.provider, // "github" | "bitbucket"
        owner,
        repo: repoName,
        ref: selectedBranch,
      });

      let url = "";

      if (path) {
        const fileParams = new URLSearchParams({
          ...Object.fromEntries(commonParams),
          filename: "/" + path,
        });

        url = `${baseUrl}/reviews/last?${fileParams.toString()}`;
      } else {
        url = `${baseUrl}/reviews/full/last?${commonParams.toString()}`;
      }

      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      const mappedResponse = normalizeLastReviewResponse(data, owner, repoName);

      console.log("Fetched last review data:", mappedResponse);

      setReviewData(mappedResponse);
      setIsReviewOpen(true);
      setShowFile(false);
    } catch (err) {
      console.error("Failed to load last review:", err);
      toast.info("No previous review found.");
      setReviewData(null);
      setIsReviewOpen(false);
      setShowFile(true);
    } finally {
      setIsReviewLoading(false);
    }
  };


  const fetchFiles = async () => {
    setFileLoading(true);
    if (!session?.provider) {
      toast.error("Provider missing from session");
      return;
    }

    try {
      const params = new URLSearchParams({
        provider: session.provider, // "github" | "bitbucket"
        owner,
        repo: repoName,
        ref: selectedBranch,
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/files?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      if (!Array.isArray(data.files)) {
        throw new Error("Invalid response shape: files is not an array");
      }

      setFileList(data.files);
    } catch (err) {
      console.error("Failed to fetch reviewed files:", err);
      setFileList([]); // fail safe
    }
    finally {
      setFileLoading(false);
    }
  };


  const handleFullReview = async () => {
    if (!session?.provider || !session?.accessToken) {
      toast.error("Authentication token missing");
      return;
    }
    const payload = {
      provider: session.provider,
      accessToken: session.accessToken,
      action: "full",
      owner,
      repo: repoName,
      ref: selectedBranch,
    };

    try {
      const mappedResponse = await sendReviewRequest(payload);

      setReviewData(mappedResponse);
      setIsReviewOpen(true);
      setShowFile(false);
    } catch (err) {
      console.error("Error reviewing repository:", err);
      toast.error("AI review service failed");
      setReviewData(null);
      setIsReviewOpen(false);
      setShowFile(true);
    }
  };


  const handleCloseReview = () => {
    fetchFiles();
    setIsReviewOpen(false);
    setShowFile(true);
  };

  useEffect(() => {
    fetchBranches();
  }, [owner, repoName]);


  useEffect(() => {
    fetchFiles();
  }, [owner, repoName, selectedBranch]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {isReviewLoading && (
        <Loader />
      )}
      {/* Files UI */}
      {!isReviewLoading && showFile && (
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold font-mono mb-1">{repoName}</h2>
              <p className="text-muted-foreground">
                {/* {displayFiles.length} files found */}
              </p>
            </div>
            <div className=" gap-4 flex">
              {/* <Button
              variant="outline"
              onClick={fetchLastReview}
              className="border-primary/50 hover:bg-primary hover:text-primary-foreground"
            >
              View Last Review
            </Button> */}
              <div className="relative">
                <BiGitBranch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />

                {selectedBranch && (
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="border h-9 pl-10 pr-3 rounded-xl px-2 py-1 bg-background"
                  >
                    {branches.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                )}

              </div>

              <Button
                variant="outline"
                onClick={() => fetchLastReview()}
                className="border-primary/50 hover:bg-primary hover:text-primary-foreground"
              >
                Overall Last Review
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground glow-effect"
                onClick={() => handleFullReview()}
              >
                Review Full Project
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-[300px_1fr] h-[600px] gap-4">

            <ScrollArea className="h-[600px] pr-4">
              {fileLoading && (
                <Loader />
              )}
              {!fileLoading && (
                <div className="space-y-2">
                  <FileTree
                    nodes={fileTree}
                    selectedPath={selectedPath}
                    onSelect={async (path) => {
                      setSelectedPath(path);
                      setIsFileLoading(true);

                      try {
                        const content = await fetchFileContent(
                          owner,
                          repoName,
                          path,
                          selectedBranch,
                          session!.accessToken!,
                          session!.provider!,
                        );
                        setSelectedContent(content);
                      } finally {
                        setIsFileLoading(false);
                      }
                    }}

                  />

                </div>
              )}
            </ScrollArea>

            <div className="relative flex flex-col h-full">

              {selectedPath && !isImageFile(selectedPath) && (
                <div className="absolute top-5 right-10 flex gap-2 z-10">
                  {normalizedFileList.includes(selectedPath) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fetchLastReview(selectedPath)}
                    >
                      View Last Review
                    </Button>
                  )}

                  <Button
                    size="sm"
                    onClick={() => handleReviewFile(selectedPath)}
                  >
                    Review File
                  </Button>
                </div>
              )}

              <ScrollArea className=" h-[600px] flex-1 p-2 font-mono text-sm bg-muted rounded-lg">
                {isFileLoading || fileLoading ? (
                  <CodeSkeleton />
                ) : selectedPath ? (
                  <CodeViewer
                    code={selectedContent}
                    language={getLanguage(selectedPath!)}
                  />
                ) : (
                  <div className="text-muted-foreground">
                    Select a file to view its content
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      )}

      {!isReviewLoading && isReviewOpen && reviewData && (
        <AnalysisDashboard response={reviewData} onClose={handleCloseReview} fetchFiles={fetchFiles} />
      )}
    </div>
  );
};

export default FileExplorer;