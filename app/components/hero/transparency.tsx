import { Check, X } from "lucide-react";

const isItems = [
  "Semantic code review using LLM reasoning",
  "Architectural pattern and coupling analysis",
  "Maintainability and technical debt assessment",
  "Documentation gap identification",
  "Testability and risk pattern detection",
  "Actionable refactoring suggestions",
];

const isNotItems = [
  "A static code analyzer or linter",
  "A security vulnerability scanner",
  "A formal verification tool",
  "A replacement for human code review",
  "100% accurate on every judgment call",
];

const Transparency = () => {
  return (
    <section id="transparency" className="relative py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            What this is — and isn't
          </h2>
          <p className="text-lg text-muted-foreground">
            We believe in honest tooling. Here's exactly what you can expect.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-4xl gap-8 lg:grid-cols-2">
          {/* What it is */}
          <div className="rounded-xl border border-success/20 bg-success/5 p-8">
            <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold text-success">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                <Check className="h-5 w-5" />
              </div>
              What it is
            </h3>
            <ul className="space-y-4">
              {isItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* What it isn't */}
          <div className="rounded-xl border border-muted bg-muted/30 p-8">
            <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <X className="h-5 w-5" />
              </div>
              What it isn't
            </h3>
            <ul className="space-y-4">
              {isNotItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="rounded-xl border border-border bg-card/50 p-6 text-center">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Our philosophy:</strong> AI code review is a powerful tool, 
              not a silver bullet. We surface insights a senior engineer would notice—but the final call 
              on what to fix is always yours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Transparency;
