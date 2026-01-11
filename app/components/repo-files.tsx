"use client";
import { CiFolderOn, CiFileOn } from "react-icons/ci";
import { GoChevronRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { AnalysisDashboard } from "./analysis-dashboard";
import Loader from "./loader";
import { toast } from "sonner"

import { create } from "domain";
import { log } from "console";

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

const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp"];


export const FileExplorer = ({
  files,
  repoName,
  owner,
}: FileExplorerProps) => {
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [reviewData, setReviewData] = useState<AnalysisResponse | null>(null);
  const [showFile, setShowFile] = useState(true);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [lastReviewedFile, setLastReviewedFile] = useState<string | null>(null);
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

  const displayFiles = files.filter((f) => f.type === "blob");

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
    const filename = path.startsWith("/") ? path : `/${path}`;

    const payload = {
      action: "file",
      owner,
      repo: repoName,
      ref: "main",
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
    console.log("Fetching last review for file:", path);
    setIsReviewLoading(true);

    try {
      const project = `${owner}/${repoName}@main`;
      console.log("project", project)
      const params = new URLSearchParams({
        project,
        // filename is OPTIONAL — backend supports it
        filename: "/" + path,
      });

      // const res = await fetch(
      //   // http://127.0.0.1:8000/reviews/last?project=OfficialSaurabh/Book-Reading-List@main&filename=/src/component/BookCreate.js
      //   `http://127.0.0.1:8000/reviews/last?${params.toString()}`,
      //   {
      //     method: "GET",
      //     headers: { Accept: "application/json" },
      //   }
      // );
      const url = path
      ? `http://127.0.0.1:8000/reviews/last?${params.toString()}`
      : `http://127.0.0.1:8000/reviews/full/last?project=${project}`;

      const res = await fetch(url, { headers: { Accept: "application/json" } });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const mappedResponse = normalizeLastReviewResponse(
        data,
        owner,
        repoName
      );

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
  try {
    const project = `${owner}/${repoName}@main`;

    const res = await fetch(
      `http://127.0.0.1:8000/reviews/files?project=${encodeURIComponent(project)}`,
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

    // Defensive check (backend can evolve)
    if (!Array.isArray(data.files)) {
      throw new Error("Invalid response shape: files is not an array");
    }

    setFileList(data.files);
  } catch (err) {
    console.error("Failed to fetch reviewed files:", err);
    setFileList([]); // fail safe
  }
};

  const handleFullReview = async () => {
    const payload = {
      action: "full",
      owner,
      repo: repoName,
      ref: "main",
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
    setIsReviewOpen(false);
    setShowFile(true);
  };

  useEffect(() => {
  fetchFiles();
}, [owner, repoName]);

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
                {displayFiles.length} files found
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

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-2">
              {displayFiles.map((file) => (
                <div
                  key={file.sha}
                  className="glass-card p-4 rounded-lg hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm truncate group-hover:text-primary transition-colors">
                          {file.path}
                        </p>
                        {file.size && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatFileSize(file.size)}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* <Button onClick={ () =>getFileContent(file.path)} >
                    Load Content
                  </Button> */}
                    {!isImageFile(file.path) && (
                      <div className="gap-4 flex">
                        {/* Check if the fileList = file.path then only show the View LAst Review BUtton */}
                        {normalizedFileList.includes(file.path) && (

                        <Button
                          variant="outline"
                          onClick={() => fetchLastReview(file.path)}
                          className="border-primary/50 hover:bg-primary hover:text-primary-foreground"
                        >
                          View Last Review
                        </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => handleReviewFile(file.path)}
                          size="sm"
                          className="border-primary/50 hover:bg-primary hover:text-primary-foreground shrink-0"
                        >
                          <span className="flex items-center gap-1">
                            Review File
                            <GoChevronRight className="w-3 h-3" />
                          </span>
                        </Button>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {!isReviewLoading && isReviewOpen && reviewData && (
        <AnalysisDashboard response={reviewData} onClose={handleCloseReview} />
      )}
    </div>
  );
};

export default FileExplorer;