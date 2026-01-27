import React from 'react';
import { CheckCircle2, AlertTriangle, FileCode, Users, Terminal } from 'lucide-react';

const cases = [
  {
    type: "Internal Project",
    title: "Improving Code Maintainability in a Mid-Size React Project",
    tags: ["React + Node.js", "~40K LOC", "4 Developers"],
    problem: [
      "High cyclomatic complexity",
      "Inconsistent documentation",
      "Hard-to-test modules"
    ],
    helper: [
      "Scanned the entire repository in under 2 minutes",
      "Flagged files with high complexity scores",
      "Identified undocumented public functions",
      "Highlighted modules lacking unit tests"
    ],
    outcome: [
      "22 high-complexity files identified",
      "31 undocumented functions flagged",
      "Clear refactor recommendations generated",
      "Reduced onboarding time for new developers"
    ],
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  },
  {
    type: "Pilot Analysis",
    title: "Faster Code Reviews for a Solo Developer",
    tags: ["Spring Boot API", "Solo Dev", "Efficiency"],
    problem: [
      "Manual self-reviews were inconsistent",
      "Time-consuming process"
    ],
    helper: [
      "AI-generated review summary before every PR",
      "Caught missing exception handling",
      "Identified unused classes"
    ],
    outcome: [
      "Caught missing exception handling and unused classes",
      "Saved ~30% time per review"
    ],
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  }
];

export default function CaseStudies() {
  return (
    <section className="py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Real World Impact(Case Studies)</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          See how teams and developers use AI Project Review to improve their codebases.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto px-4">
        {cases.map((study, idx) => (
          <div key={idx} className="flex flex-col rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-6 border-b bg-muted/20">
              <div className={`mb-3 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${study.color}`}>
                {study.type}
              </div>
              <h3 className="text-xl font-bold mb-3">{study.title}</h3>
              <div className="flex flex-wrap gap-2">
                {study.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-background border text-muted-foreground font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 flex-1">
              {/* Problem */}
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                  <AlertTriangle className="h-4 w-4" /> Problem
                </h4>
                <ul className="space-y-2">
                  {study.problem.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solution/Helper */}
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                  <Terminal className="h-4 w-4" /> AI Analysis
                </h4>
                <ul className="space-y-2">
                  {study.helper.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcome */}
              <div className="pt-4 border-t mt-auto">
                <h4 className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Outcome
                </h4>
                <ul className="space-y-2">
                  {study.outcome.map((item, i) => (
                    <li key={i} className="text-sm font-medium flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
