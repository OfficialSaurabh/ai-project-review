import {
  FileCode2,
  GitPullRequest,
  BarChart3,
  FileSearch,
  Wrench,
  History
} from "lucide-react";

const features = [
  {
    icon: FileCode2,
    title: "Line-Accurate Detection",
    description: "Every issue pinpoints exact line numbers. Click to jump directly to problematic code in the viewer.",
  },
  {
    icon: GitPullRequest,
    title: "Architectural Analysis",
    description: "Coupling patterns, dependency health, and module boundaries—not just syntax issues.",
  },
  {
    icon: BarChart3,
    title: "Quality Scoring",
    description: "Structured metrics for complexity, readability, testability, and documentation coverage.",
  },
  {
    icon: FileSearch,
    title: "Severity Classification",
    description: "Critical, major, and minor issue tiers help you prioritize what matters most.",
  },
  {
    icon: Wrench,
    title: "Suggested Fixes",
    description: "Unified diff-style patches for each issue. Review and apply refactors with confidence.",
  },
  {
    icon: History,
    title: "Review History",
    description: "Track code quality over time. Compare against previous analyses to measure improvement.",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative border-t border-border py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05)_0%,transparent_70%)]" />

      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            What gets analyzed
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive semantic analysis powered by LLM reasoning
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border bg-card/50 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
