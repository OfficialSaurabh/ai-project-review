const lineWidths = [
  80, 82, 90, 50, 88, 65, 92, 75, 85, 68,
  94, 80, 86, 72, 91, 78, 84, 69, 95, 83,
  89, 74, 87, 66, 93, 79
];

export const CodeSkeleton = () => {
  return (
    <div className="h-full w-full bg-[#202E40] p-4 space-y-2 animate-pulse">
      {lineWidths.map((w, i) => (
        <div
          key={i}
          className="h-3 rounded bg-white/10"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
};
export default CodeSkeleton;