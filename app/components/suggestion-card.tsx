import { useState } from "react";
import { CodeSnippet } from "./code-snippet";

interface Suggestion {
  title: string;
  explanation: string;
  diff_example?: string;
}

interface SuggestionCardProps {
  suggestions: Suggestion[];
  language: string;
}

export const SuggestionCard = ({ suggestions, language }: SuggestionCardProps) => {
  const [open, setOpen] = useState(false);

  if (!suggestions?.length) return null;

  return (
    <div className="mt-3">
      <button
        className="text-sm font-medium text-primary hover:underline cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        {open
          ? "Hide Suggested Fix"
          : `Show Suggested Fix (${suggestions.length})`}
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${open ? "max-h-[1000px] opacity-100 mt-3" : "max-h-0 opacity-0"}
        `}
      >
        <div className="border-t pt-3 space-y-3">
          {suggestions.map((s, i) => (
            <div key={i} className="rounded-md bg-background/60 p-3 border">
              <p className="font-medium text-sm">{s.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {s.explanation}
              </p>

              {s.diff_example && (
                <div className="mt-2">
                  <CodeSnippet
                    code={s.diff_example}
                    language={language}
                    startLine={0}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;