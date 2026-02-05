"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LastReviewTableSkeleton } from "./last-review-table-skeleton";
import { formatRelativeTime } from "../utils/formatRelativeTime";

interface LastReviewedFile {
  filename: string;
  language: string;
  fileScore: number;
  totalIssues: number;
  criticalIssues: number;
  majorIssues: number;
  summary: string;
  lastReviewedAt?: string;
}

interface LastReviewTableProps {
  data: LastReviewedFile[];
  loading?: boolean;
  onView: (filename: string) => void;
}

export const LastReviewTable = ({
  data,
  loading = false,
  onView,
}: LastReviewTableProps) => {
  const getScoreColorClass = (score: number) => {
    if (score === 0) return "text-muted-foreground";
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBgClass = (score: number) => {
    if (score === 0) return "bg-foreground/5";
    if (score >= 80) return "bg-success/15";
    if (score >= 60) return "bg-warning/15";
    return "bg-destructive/15";
  };

  if (loading) {
    return (
      <LastReviewTableSkeleton />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        No reviews found for this branch.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>File</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead className="text-center">Critical</TableHead>
            <TableHead className="text-center">Major</TableHead>
            <TableHead >Summary</TableHead>
            <TableHead >Last Reviewed</TableHead>
            <TableHead className="text-center">Action</TableHead>

          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((file) => (
            <TableRow
              key={file.filename}
              className="hover:bg-muted/50"
            >
              <TableCell className="font-mono text-xs max-w-[320px] truncate">
                {file.filename}
              </TableCell>
              <TableCell className="text-center">
                <div
                  className={`
                  inline-flex items-center justify-center
                  min-w-[48px] px-2 py-1 rounded-md font-semibold
                  ${getScoreColorClass(file.fileScore)}
                  ${getScoreBgClass(file.fileScore)}
                `}
                >
                  {file.fileScore}
                </div>
              </TableCell>

              <TableCell className="text-center">
                <div
                  className={`
                  inline-flex items-center justify-center
                  min-w-[48px] px-2 py-1 rounded-md font-semibold
                  ${getScoreColorClass(file.criticalIssues)}
                  ${getScoreBgClass(file.criticalIssues)}
                `}
                >
                  {file.criticalIssues}
                </div>
              </TableCell>

              <TableCell className="text-center">
                <div
                  className={`
                  inline-flex items-center justify-center
                  min-w-[48px] px-2 py-1 rounded-md font-semibold
                  ${getScoreColorClass(file.majorIssues)}
                  ${getScoreBgClass(file.majorIssues)}
                `}
                >
                  {file.majorIssues}
                </div>
              </TableCell>

              <TableCell className="text-sm">
                {file.summary}
              </TableCell>
              <TableCell className="text-sm">
                {file.lastReviewedAt
                  ? formatRelativeTime(file.lastReviewedAt)
                  : "—"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  className=" cursor-pointer "
                  onClick={() => onView(file.filename)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LastReviewTable;