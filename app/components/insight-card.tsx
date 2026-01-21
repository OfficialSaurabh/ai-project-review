import { useState } from "react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GoXCircle } from "react-icons/go";
import { Badge } from "@/components/ui/badge";
import { Button } from "@headlessui/react";
import jumpToLine from "../utils/jumpToLine";
import { CodeSnippet } from "./code-snippet";
import { SuggestionCard } from "./suggestion-card"

interface Suggestion {
  title: string;
  explanation: string;
  diff_example?: string;
}

interface InsightCardProps {
  category: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  description: string;
  startLine: number;
  endLine: number;
  codeSnippet: string;
  language: string;
  suggestions?: Suggestion[];
}

export const InsightCard = ({
  category,
  type,
  title,
  description,
  startLine,
  endLine,
  codeSnippet,
  language,
  suggestions = [],   // default to empty array (kills undefined issue)
}: InsightCardProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="w-5 h-5 text-success" />;
      case "warning":
        return <FiAlertTriangle className="w-5 h-5 text-warning" />;
      case "error":
        return <GoXCircle className="w-5 h-5 text-destructive" />;
      default:
        return <IoMdInformationCircleOutline className="w-5 h-5 text-primary" />;
    }
  };

  const getBadgeVariant = () => {
    switch (type) {
      case "success":
        return "default";
      case "warning":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl hover:border-border transition-all">
      <div className="flex items-start gap-4 mb-4">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={getBadgeVariant()} className="font-mono text-xs">
              {category}
            </Badge>
          </div>

          <div className="flex items-center justify-between space-y-2">
            <h4 className="font-semibold">{title}</h4>
            <Button
              className="text-sm cursor-pointer hover:underline bg-transparent p-0"
              onClick={() => {
                document.querySelector("pre.line-numbers")?.scrollIntoView();
                setTimeout(() => jumpToLine(startLine, endLine), 200);
              }}
            >
              View in Code (lines {startLine}-{endLine})
            </Button>
          </div>


          <p className="text-sm text-muted-foreground mb-2">
            {description}
          </p>

          <div className="bg-muted rounded-md w-full mb-2">
            <CodeSnippet
              code={codeSnippet}
              language={language}
              startLine={startLine}
            />
          </div>

          <SuggestionCard
            suggestions={suggestions ?? []}
            language={language}
          />


        </div>
      </div>
    </div>
  );
};
