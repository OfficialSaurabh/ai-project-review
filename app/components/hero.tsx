import React from 'react'
import { FiGithub } from "react-icons/fi";
import { useSession, signIn, signOut } from "next-auth/react"


function hero() {
  // const { data: session } = useSession()

  return (
    // Logged-out UI
            <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center animate-in fade-in slide-in-from-bottom duration-700">
              {/* Left: copy + CTA */}
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Connect GitHub to start analyzing your repos
                </div>

                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  Sign in to unlock repo analysis
                </h2>

                <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                  Link your GitHub account and we&apos;ll automatically pull your repositories, run AI analysis on
                  structure, readability, and documentation, and surface the highest-impact improvements.
                </p>

                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Rank repos by potential risk, complexity, or tech debt.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Get file-level suggestions on clarity, structure, and naming.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Spot missing docs, weak tests, and inconsistent patterns fast.</span>
                  </li>
                </ul>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => signIn()}
                    className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium bg-foreground text-background hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    <FiGithub className="h-4 w-4" />
                    Continue with GitHub
                  </button>

                  <p className="text-xs text-muted-foreground">
                    Read-only access. We only use your repos for analysis.
                  </p>
                </div>
              </div>

              {/* Right: mock analysis preview card */}
              <div className="rounded-2xl border bg-card/60 backdrop-blur-sm p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Preview</p>
                    <p className="text-sm font-medium">What you&apos;ll see after signing in</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    AI insights
                  </span>
                </div>

                {/* Fake repo row */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="space-y-0.5">
                      <p className="font-medium">project-dashboard</p>
                      <p className="text-xs text-muted-foreground">
                        Overall score: <span className="font-semibold text-amber-500">7.2 / 10</span>
                      </p>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>⭐ 34</span>
                      <span>🍴 5</span>
                      <span>TS</span>
                    </div>
                  </div>

                  <div className="h-[1px] bg-border" />

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <div>
                        <p className="font-medium">High complexity in `src/components/*`</p>
                        <p className="text-muted-foreground">
                          Multiple files exceed recommended cyclomatic complexity. Consider splitting UI + logic and
                          extracting reusable hooks.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <div>
                        <p className="font-medium">Good test coverage in `services/`</p>
                        <p className="text-muted-foreground">
                          Service layer has consistent unit tests with clear naming and isolation.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                      <div>
                        <p className="font-medium">Missing docs for public APIs</p>
                        <p className="text-muted-foreground">
                          Exported functions in `api/` folder lack JSDoc / comments. Add short descriptions for external
                          consumers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skeleton row hint */}
                <div className="mt-4 grid gap-3 text-xs text-muted-foreground">
                  <div className="h-2.5 rounded-full bg-muted animate-pulse" />
                  <div className="h-2.5 w-4/5 rounded-full bg-muted animate-pulse" />
                  <div className="h-2.5 w-3/5 rounded-full bg-muted animate-pulse" />
                </div>
              </div>
            </div>
         
  )
}

export default hero