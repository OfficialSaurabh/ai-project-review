"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@headlessui/react";


type LocalFile = {
  filename: string;
  content: string;
  size: number;
  setReviewLocalFile?: (value: boolean) => void;
};

type ReviewResult = any; // keep flexible for now

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
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  async function handleReview() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "local",
          action: "file",
          files: files.map(f => ({
            filename: f.filename,
            content: f.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Review failed");
        return;
      }

      setResult(data);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFiles([]);
    setResult(null);
    setError(null);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* EMPTY / DROP ZONE */}
      {!files.length && !loading && !result && (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
      ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        >
          <Button
            variant="ghost"
            size="icon"
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

          <input {...getInputProps()} />

          <h2 className="text-xl font-semibold">Drag & drop files here</h2>
          <p className="text-sm text-gray-500 mt-2">
            Max {MAX_FILES} files • {MAX_FILE_SIZE / 1024} KB each
          </p>
        </div>
      )}


      {/* FILE LIST */}
      {!!files.length && !result && (
        <div className="space-y-3">
          <ul className="border rounded-lg divide-y">
            {files.map((f, i) => (
              <li key={i} className="flex justify-between p-3 text-sm">
                <span>{f.filename}</span>
                <span className="text-gray-500">
                  {(f.size / 1024).toFixed(1)} KB
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleReview}
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Reviewing…" : "Review Files"}
          </button>

          <button
            onClick={reset}
            className="w-full text-sm text-gray-500"
          >
            Reset
          </button>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Review Result</h2>

          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>

          <button
            onClick={reset}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Review More Files
          </button>
        </div>
      )}
    </div>
  );
}
