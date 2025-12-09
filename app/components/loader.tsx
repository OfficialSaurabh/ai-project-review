export const AppLoader = () => (
  <div className="glass-card p-6 rounded-xl flex justify-center">
  <div className="flex flex-col items-center gap-3 p-6 animate-in fade-in">
    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="text-sm text-muted-foreground font-mono tracking-wide">
      Loading...
    </p>
  </div>
  </div>
);

export default AppLoader;