import { useState } from "react";
import { LuFileCode2, LuZap } from "react-icons/lu";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { HealthScore } from "./health-score";
import { InsightCard } from "./insight-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisMetrics {
  testCoverageEstimate: number;
  documentationScore: number;
  readability: number;
}

interface TopIssue {
  line: number | null;
  severity: string;
  type: string;
  message: string;
}

interface AnalysisDashboardProps {
  response: {
    project: string;
    createdAt: string;
    overallFileScore: number;
    metrics: AnalysisMetrics;
    topIssues?: TopIssue[]; // <-- you ARE using this
  };
  onClose: () => void;
  fetchFiles: () => Promise<void>;
}

type AnalysisResponse = {
  project: string;
  createdAt: string;
  overallFileScore: number;
  metrics: AnalysisMetrics;
  topIssues?: TopIssue[];
};

type InsightType = "success" | "warning" | "error" | "info";

const mapSeverityToType = (severity: string): InsightType => {
  const normalized = severity.toLowerCase();
  if (normalized === "major" || normalized === "critical") return "error";
  if (normalized === "minor" || normalized === "warning") return "warning";
  return "info";
};

// Decide which tab an issue belongs to, based on its type
const categorizeIssue = (
  category: string
): "structure" | "quality" | "docs" => {
  const t = category.toLowerCase();
  if (
    t.includes("security") ||
    t.includes("maintainability") ||
    t.includes("performance") ||
    t.includes("complexity") ||
    t.includes("correctness")
  ) {
    return "quality";
  }

  if (
    t.includes("documentation") ||
    t.includes("readme") ||
    t.includes("comment") ||
    t.includes("doc")
  ) {
    return "docs";
  }

  return "structure";
};

export const AnalysisDashboard = ({
  response,
  onClose,
  fetchFiles,
}: AnalysisDashboardProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  console.log("AnalysisDashboard response:", response.createdAt);
  const formatDate = (date: string | Date) => {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };


  // Flatten topIssues -> generic insight objects (max 4)
  const issueInsights = (response.topIssues ?? [])
    .slice(0, 4)
    .map((issue) => ({
      category: issue.type,
      type: mapSeverityToType(issue.severity),
      title: `Line ${issue.line ?? "N/A"} – ${issue.type}`,
      description: issue.message,
      suggestions: [] as string[],
    }));

  // Group insights into the three buckets
  const grouped = {
    structure: [] as typeof issueInsights,
    quality: [] as typeof issueInsights,
    docs: [] as typeof issueInsights,
  };

  issueInsights.forEach((insight) => {
    const bucket = categorizeIssue(insight.category);
    grouped[bucket].push(insight);
  });

  const handleFileReview = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold font-mono mb-1">
              {response.project}
            </h2>
            <p className="text-muted-foreground">
              {response?.createdAt
                ? `Last Review: ${formatDate(response.createdAt)}`
                : "Project Analysis Report"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
            aria-label="Close analysis"
          >
            ×
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <HealthScore
            score={response.overallFileScore}
            label="Overall Health"
          />
          <HealthScore
            score={response.metrics.testCoverageEstimate}
            label="Code Coverage"
          />
          <HealthScore
            score={response.metrics.documentationScore}
            label="Documentation"
          />
          <HealthScore
            score={response.metrics.readability}
            label="Readability"
          />
        </div>
      </div>

      <Tabs defaultValue="structure" className="space-y-6">
        <TabsList className="glass-card p-1 grid w-full grid-cols-3">
          <TabsTrigger
            value="structure"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <LuFileCode2 className="w-4 h-4 mr-2" />
            Structure
          </TabsTrigger>
          <TabsTrigger
            value="quality"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <LuZap className="w-4 h-4 mr-2" />
            Quality
          </TabsTrigger>
          <TabsTrigger
            value="docs"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <HiOutlineBookOpen className="w-4 h-4 mr-2" />
            Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          {grouped.structure.length > 0 ? (
            grouped.structure.map((insight, index) => (
              <InsightCard key={index} {...insight} />
            ))
          ) : (
            <div className="glass-card p-6 rounded-xl hover:border-border transition-all">
              <p className="text-sm text-muted-foreground">
                No structure issues found.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          {grouped.quality.length > 0 ? (
            grouped.quality.map((insight, index) => (
              <InsightCard key={index} {...insight} />
            ))
          ) : (
            <div className="glass-card p-6 rounded-xl hover:border-border transition-all">
              <p className="text-sm text-muted-foreground">
                No quality issues found.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          {grouped.docs.length > 0 ? (
            grouped.docs.map((insight, index) => (
              <InsightCard key={index} {...insight} />
            ))
          ) : (
            <div className="glass-card p-6 rounded-xl hover:border-border transition-all">
              <p className="text-sm text-muted-foreground">
                No documentation issues found.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
