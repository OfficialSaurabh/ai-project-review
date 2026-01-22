import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import { FiGithub } from "react-icons/fi";

const Cta = () => {
  return (
    <section className="relative border-t border-border py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.1)_0%,transparent_60%)]" />
      
      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">Free for open source projects</span>
          </div>
          
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Discover what your codebase
            <br />
            <span className="text-gradient">has been hiding</span>
          </h2>
          
          <p className="mb-10 text-lg text-muted-foreground">
            Get your first analysis in under 5 minutes. 
            No credit card, no commitment—just honest code review.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="default" size="lg" className="group">
              <FiGithub className="h-5 w-5" />
              Connect Your Repo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          <p className="mt-8 text-sm text-muted-foreground">
            Trusted by developers at startups and enterprises alike.
            <br />
            Read-only access—your code stays in your infrastructure.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Cta;
