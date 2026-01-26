import React from 'react'
import { FiGithub } from "react-icons/fi";
import { FaBitbucket } from "react-icons/fa6";
import { useSession, signIn, signOut } from "next-auth/react"
import HowItWorks from "./how-it-work";
import Features from './feature';
import Cta from './cta';
import Transparency from './transparency';
import { Stick } from 'next/font/google';
import StickyScrollReveal from './sticky-scroll-reveal';


function Hero({ onGuestReview }: { onGuestReview: () => void }) {
  // const { data: session } = useSession()

  return (
    <>

      <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center animate-in fade-in slide-in-from-bottom duration-700">
        {/* Left: copy + CTA */}
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Powered by Google Gemini 2.5
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Automated Code Reviews for Real Repositories
          </h2>

          <p className="text-sm md:text-base text-muted-foreground max-w-xl">
            Connect your GitHub or Bitbucket in read-only mode and get an AI-powered audit of
            code quality, architecture, documentation gaps, and maintainability risks —
            across your entire project, not just a single file.
          </p>

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Repository-level health score with complexity, test coverage, and tech-debt signals.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>File-level AI review: structure, naming, coupling, and refactoring suggestions.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Automatic detection of missing documentation, weak boundaries, and risky patterns.</span>
            </li>
          </ul>



          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => signIn("github")}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium bg-foreground text-background hover:opacity-90 transition"
            >
              <FiGithub className="h-4 w-4" />
              Analyze with GitHub
            </button>

            <button
              type="button"
              onClick={() => signIn("bitbucket")}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium bg-[#2684FF] text-white hover:brightness-110 transition"
            >
              <FaBitbucket className="h-4 w-4" />
              Analyze with Bitbucket
            </button>
            {/* Guest */}
            <button
              type="button"
              onClick={onGuestReview}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium bg-muted hover:bg-muted/80 transition"
            >
              Try as Guest (Local File)
            </button>
          </div>

          <div className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-xl">
            <strong>Read-only access. No code is modified.</strong>
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
      <Features />
      <HowItWorks />
      {/* <StickyScrollReveal /> */}
      <Transparency />
      {/* <Cta /> */}
    </>
  )
}

export default Hero