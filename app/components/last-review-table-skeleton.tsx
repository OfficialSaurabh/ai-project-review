"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";

const rowWidths = [
  [60, 40, 30, 30, 80, 20],
  [70, 50, 40, 35, 75, 25],
  [55, 45, 35, 30, 85, 20],
  [65, 50, 40, 35, 70, 25],
  [60, 45, 35, 30, 80, 20],
];

export const LastReviewTableSkeleton = () => {
  return (
    <div className="rounded-lg border border-border overflow-hidden animate-pulse">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            {["File", "Score", "Critical", "Major", "Summary", ""].map((_, i) => (
              <TableHead key={i}>
                <div className="h-4 w-16 rounded bg-white/10" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rowWidths.map((cols, rowIdx) => (
            <TableRow key={rowIdx}>
              {cols.map((w, colIdx) => (
                <TableCell key={colIdx}>
                  <div
                    className="h-3 rounded bg-white/10"
                    style={{ width: `${w}%` }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LastReviewTableSkeleton;
