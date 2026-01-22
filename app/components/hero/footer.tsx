import { GitBranch } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 py-5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <GitBranch className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold">AI Project Analyzer</span>
          </div>
          
          {/* <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
            <a href="#" className="transition-colors hover:text-foreground">Terms</a>
            <a href="#" className="transition-colors hover:text-foreground">Documentation</a>
            <a href="#" className="transition-colors hover:text-foreground">Contact</a>
          </div> */}
          
          <p className="text-sm text-muted-foreground">
            © 2025 AI Project Analyzer
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
