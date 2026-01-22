import { GitBranch, Cpu, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: GitBranch,
    step: "01",
    title: "Connect your repository",
    description: "Grant read-only access to your GitHub or Bitbucket repo. We never write, push, or store your code.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI performs semantic review",
    description: "Google Gemini 2.5 analyzes your codebase like a Staff Engineer—evaluating structure, patterns, and real-world risk.",
  },
  {
    icon: CheckCircle2,
    step: "03",
    title: "Review actionable insights",
    description: "Get file-level reports with severity ratings, quality scores, and diff-style fixes you can apply directly.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative border-y border-border py-20">
      <div className="absolute inset-0 from-background via-secondary/20 to-background" />
      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground">
            From connection to actionable insights in under 5 minutes.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 top-12 hidden h-[calc(100%-6rem)] w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent lg:block" />

            <div className="space-y-12 lg:space-y-16">
              {steps.map((step, index) => (
                <div key={step.step} className="relative flex gap-8">
                  {/* Step indicator */}
                  <div className="hidden shrink-0 lg:block">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 rounded-xl border border-border bg-card/50 p-6 transition-colors hover:bg-card lg:p-8">
                    <div className="mb-4 flex items-center gap-4 lg:hidden">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-mono text-sm text-primary">{step.step}</span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="mb-2 hidden font-mono text-sm text-primary lg:block">{step.step}</span>
                        <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
