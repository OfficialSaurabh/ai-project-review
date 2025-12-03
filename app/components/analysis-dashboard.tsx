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

interface AnalysisDashboardProps {
  response: {
    project: string;
    overallFileScore: number;
    metrics: AnalysisMetrics;
  };
  onClose: () => void;
}

export const AnalysisDashboard = ({ response, onClose, }: AnalysisDashboardProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock data - in real implementation, this would come from actual analysis
  const mockAnalysis = {
    overallScore: 78,
    codeQuality: 85,
    documentation: 65,
    security: 82,
    insights: {
      structure: [
        {
          category: "Architecture",
          type: "success" as const,
          title: "Well-organized component structure",
          description: "Components follow a clear hierarchical pattern with proper separation of concerns.",
          suggestions: ["Consider implementing a feature-based folder structure for larger components"],
        },
        {
          category: "Dependencies",
          type: "warning" as const,
          title: "Outdated dependencies detected",
          description: "Some packages are several versions behind their latest releases.",
          suggestions: [
            "Update React from 18.2.0 to 18.3.1",
            "Update TypeScript to latest version",
          ],
        },
      ],
      quality: [
        {
          category: "Code Quality",
          type: "success" as const,
          title: "Consistent code style",
          description: "ESLint configuration is properly set up and code follows best practices.",
          suggestions: ["Add Prettier for automatic formatting"],
        },
        {
          category: "Testing",
          type: "error" as const,
          title: "No test coverage found",
          description: "The project lacks automated tests which could lead to bugs in production.",
          suggestions: [
            "Set up Jest and React Testing Library",
            "Aim for at least 70% code coverage",
            "Start with critical user flows",
          ],
        },
      ],
      documentation: [
        {
          category: "README",
          type: "warning" as const,
          title: "Basic README present",
          description: "README exists but lacks detailed setup instructions and contribution guidelines.",
          suggestions: [
            "Add installation instructions",
            "Include usage examples",
            "Add contributing guidelines",
          ],
        },
        {
          category: "Comments",
          type: "info" as const,
          title: "Code documentation could be improved",
          description: "Complex functions would benefit from JSDoc comments.",
          suggestions: ["Add JSDoc comments to public APIs", "Document complex algorithms"],
        },
      ],
    },
  };

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
            <h2 className="text-2xl font-bold font-mono mb-1">{response.project}</h2>
            <p className="text-muted-foreground">Project Analysis</p>
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
          {/* <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleFileReview}
              disabled={isAnalyzing}
              className="border-primary/50 hover:bg-primary hover:text-primary-foreground"
            >
              {isAnalyzing ? "Analyzing..." : "Review This File"}
            </Button>
            <Button
              onClick={handleFileReview}
              disabled={isAnalyzing}
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-effect"
            >
              {isAnalyzing ? "Analyzing..." : "Review Full Project"}
            </Button>
          </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <HealthScore score={response.overallFileScore} label="Overall Health" />
          <HealthScore score={response.metrics.testCoverageEstimate} label="Code Coverage" />
          <HealthScore score={response.metrics.documentationScore} label="Documentation" />
          <HealthScore score={response.metrics.readability} label="Readability" />
        </div>
      </div>

      <Tabs defaultValue="structure" className="space-y-6">
        <TabsList className="glass-card p-1 grid w-full grid-cols-3">
          <TabsTrigger value="structure" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <LuFileCode2 className="w-4 h-4 mr-2" />
            Structure
          </TabsTrigger>
          <TabsTrigger value="quality" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <LuZap className="w-4 h-4 mr-2" />
            Quality
          </TabsTrigger>
          <TabsTrigger value="docs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <HiOutlineBookOpen className="w-4 h-4 mr-2" />
            Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          {mockAnalysis.insights.structure.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          {mockAnalysis.insights.quality.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          {mockAnalysis.insights.documentation.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
