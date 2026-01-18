const rowWidths = [70, 85, 60, 90, 75, 88, 65, 80, 70, 85, 60, 90, 75, 88, 65, 80];

export const FileTreeSkeleton = () => {
  return (
    <div className="space-y-2 p-2 animate-pulse">
      {rowWidths.map((w, i) => (
        <div
          key={i}
          className="flex items-center gap-2"
          style={{ marginLeft: `${(i % 3) * 12}px` }} // fake nesting
        >
          {/* icon placeholder */}
          <div className="h-4 w-4 rounded bg-white/10" />

          {/* text placeholder */}
          <div
            className="h-3 rounded bg-white/10"
            style={{ width: `${w}%` }}
          />
        </div>
      ))}
    </div>
  );
};

export default FileTreeSkeleton;
