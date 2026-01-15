"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@headlessui/react";
import { AnalysisDashboard } from "./analysis-dashboard";
import Loader from "./loader";
import { useSession } from "next-auth/react";

type AnalysisResponse = {
  project: string;
  overallFileScore: number;
  createdAt: string;
  metrics: {
    testCoverageEstimate: number;
    documentationScore: number;
    readability: number;
  };
  topIssues: {
    line: number | null;
    type: string;
    severity: "critical" | "major" | "minor";
    message: string;
  }[];
};


type LocalFile = {
  filename: string;
  path: string;
  content: string;
  size: number;
  setReviewLocalFile?: (value: boolean) => void;
};


const MAX_FILE_SIZE = 200 * 1024; // 200 KB
const MAX_FILES = 5;
const ALLOWED_EXTENSIONS = [
  ".js", ".ts", ".jsx", ".tsx",
  ".py", ".java", ".kt", ".go",
  ".rs", ".cpp", ".c", ".cs",
  ".php", ".rb", ".swift",
  ".html", ".css", ".scss",
  ".json", ".yml", ".yaml",
  ".md", ".sh",
];
interface LocalFileReviewProps {
  setReviewLocalFile: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LocalFileReview({ setReviewLocalFile }: LocalFileReviewProps) {
  const { data: session } = useSession();
  const owner = session?.user?.email;
  console.log("useParams in LocalFileReview:", owner);
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState<AnalysisResponse | null>(null);
  const [showFile, setShowFile] = useState(true);
  const [fileList, setFileList] = useState<string[]>([]);
  console.log("files in FileExplorer:", fileList);

  const normalizeLocalReviewResponse = (data: any): AnalysisResponse => {
    return {
      project: "Local Files",
      createdAt: new Date().toISOString(),
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

  const normalizeLastReviewResponse = (data: any) => {
    if (!data?.exists) throw new Error("No stored review exists");

    return {
      project: "Local Files",
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




  const onClose = () => {
    setReviewLocalFile(false);
  };
  const isCodeFile = (filename: string) => {
    const lower = filename.toLowerCase();
    return ALLOWED_EXTENSIONS.some(ext => lower.endsWith(ext));
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {

    setError(null);

    const newFiles: LocalFile[] = [];

    for (const file of acceptedFiles) {
      console.log("name:", file.name);
      console.log("relative:", file.webkitRelativePath);
      if (!isCodeFile(file.name)) {
        setError(`Unsupported file type: ${file.name}`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`File too large: ${file.name}`);
        return;
      }

      const content = await file.text();

      newFiles.push({
        filename: file.name,
        path: file.name,
        content,
        size: file.size,
      });
    }


    if (files.length + newFiles.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
  }, [files]);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop,
    accept: {
      "text/*": ALLOWED_EXTENSIONS,
    },
  });
  const fetchFiles = async () => {
    try {
      const project = `local:${owner}:${localProjectId}`;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/files?project=${encodeURIComponent(project)}`,
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
  async function handleReview() {
    if (!files.length || !localProjectId || !owner) {
      setError("Missing files or project context");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "file",
          mode: "local",
          owner,
          localProjectId,
          files: files.map(f => ({
            filename: f.filename,
            path: f.path,       // ✅ f exists HERE
            content: f.content,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || "Review failed");
      }

      const data = await res.json();

      // Backend may return array or single object
      const normalized = Array.isArray(data)
        ? normalizeLocalReviewResponse(data[0])
        : normalizeLocalReviewResponse(data);

      setReviewData(normalized);
      setIsReviewOpen(true);
      setShowFile(false);
    } catch (err: any) {
      setError(err.message || "Network error");
      setReviewData(null);
      setIsReviewOpen(false);
      setShowFile(true);
    } finally {
      setLoading(false);
    }
  }



  function reset() {
    setFiles([]);
    setError(null);
  }

  const handleCloseReview = () => {
    setIsReviewOpen(false);
    setShowFile(true);
  };

  const fetchLastReview = async (filename: string) => {
    const project = `local:${owner}:${localProjectId}`;

    const params = new URLSearchParams({
      project,
      filename,
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/last?${params.toString()}`
    );

    if (!res.ok) throw new Error("No review");

    const data = await res.json();
    setReviewData(normalizeLastReviewResponse(data));
    setIsReviewOpen(true);
    setShowFile(false);
  };


  const localProjectId = useMemo(() => {
    const key = `localProjectId:${owner}`;
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;

    const id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
    return id;
  }, [owner]);
  useEffect(() => {
    if (!owner || !localProjectId) return;
    fetchFiles();
  }, [owner, localProjectId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* EMPTY / DROP ZONE */}
      {showFile && !loading && !files.length && (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
      ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        >

          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
            }}
            className="absolute top-3 right-3 rounded-full"
            aria-label="Close analysis"
          >
            ×
          </Button>

          <input
            {...(getInputProps() as any)}
          />

          <h2 className="text-xl font-semibold">Drag & drop files here</h2>
          <p className="text-sm text-gray-500 mt-2">
            Max {MAX_FILES} files • {MAX_FILE_SIZE / 1024} KB each
          </p>
        </div>
      )}


      {/* FILE LIST */}
      {showFile && !!files.length && !loading && (
        <div className="space-y-3">
          <ul className="border rounded-lg divide-y">
            {files.map((f, i) => {
              const hasLastReview = fileList.includes(f.path);

              return (
                <li key={i} className="flex justify-between items-center p-3 text-sm">
                  <div>
                    <p>{f.filename}</p>
                    <p className="text-gray-500">
                      {(f.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  {/* {hasLastReview && (
                    <Button
                      variant="outline"
                      onClick={() => fetchLastReview(f.path)}
                      className="border-primary/50 hover:bg-primary hover:text-primary-foreground"
                    >
                      View Last Review
                    </Button>
                  )} */}
                </li>
              );
            })}
          </ul>
          <div className="flex gap-4 justify-end ">
            <button
              onClick={reset}
              className="border-primary/50 hover:bg-primary hover:text-primary-foreground shrink-0 glass-card p-2 rounded-lg transition-all group"
            >
              Reset
            </button>
            <button
              onClick={handleReview}
              disabled={loading}
              className="border-primary/50 hover:bg-primary hover:text-primary-foreground shrink-0 glass-card p-2 rounded-lg transition-all group"

            >
              {loading ? "Reviewing…" : "Review File"}
            </button>

          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      {/* RESULT */}
      {reviewData && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Review Result</h2>

          {/* <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre> */}
          {loading && <Loader />}
          {isReviewOpen && reviewData && (
            <AnalysisDashboard
              response={reviewData}
              onClose={() => {
                setIsReviewOpen(false);
                setShowFile(true);
              }}
              fetchFiles={fetchFiles}
            />
          )}
          {/* <button
            onClick={reset}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Review More Files
          </button> */}

        </div>
      )}
    </div>
  );
}
