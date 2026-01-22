import { IoMdTrendingUp } from "react-icons/io";
import { IoAlertCircleOutline } from "react-icons/io5";
import { FiCheckCircle } from "react-icons/fi";

interface HealthScoreProps {
  score: number;
  label: string;
}

export const HealthScore = ({ score, label }: HealthScoreProps) => {
  const getColor = () => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getIcon = () => {
    if (score >= 80) return <FiCheckCircle className="w-5 h-5" />;
    if (score >= 60) return <IoAlertCircleOutline className="w-5 h-5" />;
    return <IoAlertCircleOutline className="w-5 h-5" />;
  };

  const getBgColor = () => {
    if (score >= 80) return "from-success/20 to-success/5";
    if (score >= 60) return "from-warning/20 to-warning/5";
    return "from-destructive/20 to-destructive/5";
  };

  const tooltipMap: Record<string, string> = {
    "Overall Health":
      "Composite quality score (0–100) derived from code readability, testability, and documentation. Represents overall maintainability, change risk, and long-term support cost.",

    "Coverage Estimate":
      "AI-based estimate of how thoroughly critical execution paths are likely exercised by automated tests. Factors include test presence, isolation, dependency controllability, and error-path validation.",

    "Documentation":
      "Assesses completeness and accuracy of docstrings, comments, and public API contracts, including explanation of intent, assumptions, and edge-case behavior.",

    "Readability":
      "Evaluates cognitive load required to understand and safely modify the code, based on naming semantics, structural clarity, and control-flow complexity."

  };


  return (
    <div className={`glass-card p-6 rounded-xl bg-gradient-to-br ${getBgColor()}`}>
      <div className="flex items-center justify-between mb-4 ">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="group cursor-pointer">
          <div className={getColor()}>{getIcon()}</div>
          <div className="pointer-events-none absolute right-0 top-7 z-50 w-64 rounded-md
                  bg-background/90 backdrop-blur border border-border
                  text-foreground text-xs px-3 py-2 opacity-0
                  group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
            {tooltipMap[label] || "Score information"}
          </div>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-4xl font-bold ${getColor()}`}>{score}</span>
        <span className="text-muted-foreground mb-1">/100</span>
      </div>
      <div className="mt-4 h-2 bg-secondary/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${score >= 80
            ? "bg-success"
            : score >= 60
              ? "bg-warning"
              : "bg-destructive"
            } transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
