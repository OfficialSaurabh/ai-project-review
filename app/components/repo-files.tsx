import { CiFolderOn, CiFileOn } from "react-icons/ci";
import { GoChevronRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { AnalysisDashboard } from "./analysis-dashboard";
import Loader from "./loader";

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
  const getFileIcon = (file: FileItem) => {
    if (file.type === "tree") {
      return <CiFolderOn className="w-4 h-4 text-primary" />;
    }
    return <CiFileOn className="w-4 h-4 text-muted-foreground" />;
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

  const handleReviewFile = async (path: string): Promise<void> => {
    const filename = path.startsWith("/") ? path : `/${path}`;
    const payload = {
      action: "file",
      owner: owner,
      repo: repoName,
      ref: "main",
      filename,
    };

    try {
      if (!webhookUrl) {
        throw new Error("Missing env: NEXT_PUBLIC_REVIEW_WEBHOOK");
      }
      setIsReviewLoading(true);
      const res = await fetch(webhookUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        console.error("Review API failed", res.status, res.statusText);
        return;
      }

      const data = await res.json().catch(() => null);
      const mappedResponse = {
        project: data.project,
        overallFileScore: data.file?.overallFileScore ?? data.overallProjectScore ?? 0,
        metrics: {
          testCoverageEstimate: data.file?.metrics?.testCoverageEstimate ?? 0,
          documentationScore: data.file?.metrics?.documentationScore ?? 0,
          readability: data.file?.metrics?.readability ?? 0,
        },
        topIssues: data.topIssues ?? [],
      };

      setReviewData(mappedResponse);
      setIsReviewLoading(false);
      setIsReviewOpen(true);
      setShowFile(false);
      console.log("Review API response:", data);
    } catch (err) {
      console.error("Error calling review API", err);
      setIsReviewOpen(false);
      setShowFile(true);
      setReviewData(null);
    }
    finally {
      setIsReviewLoading(false);
    }
  };

  const handleCloseReview = () => {
    setIsReviewOpen(false);
    setShowFile(true);
  };
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {isReviewLoading && (
        <div className="glass-card p-6 rounded-xl flex justify-center">
          <Loader />
        </div>
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
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-effect"
            >
              Review Full Project
            </Button>
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