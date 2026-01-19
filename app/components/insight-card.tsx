import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GoXCircle } from "react-icons/go";
import { Badge } from "@/components/ui/badge";
import { Button } from "@headlessui/react";
import jumpToLine from "../utils/jumpToLine";
import { CodeSnippet } from "./code-snippet";

interface InsightCardProps {
  category: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  description: string;
  startLine: number;
  endLine: number;
  codeSnippet: string;
  language: string;
}

export const InsightCard = ({
  category,
  type,
  title,
  description,
  startLine,
  endLine,
  codeSnippet,
  language
}: InsightCardProps) => {
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

          <h4 className="font-semibold mb-2">{title}</h4>

          <p className="text-sm text-muted-foreground mb-2">
            {description}
          </p>

          <CodeSnippet code={codeSnippet} language={language} startLine={startLine} />

          <Button
            className="text-sm cursor-pointer"

            onClick={() => {
              document.querySelector("pre.line-numbers")?.scrollIntoView();
              setTimeout(() => jumpToLine(startLine), 200);
            }}

          >
            View in Code (lines {startLine}-{endLine})
          </Button>
        </div>
      </div>
    </div>
  );
};
