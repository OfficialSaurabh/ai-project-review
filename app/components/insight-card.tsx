import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GoXCircle } from "react-icons/go";
import { Badge } from "@/components/ui/badge";

interface InsightCardProps {
  category: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  description: string;
  suggestions: string[];
}

export const InsightCard = ({
  category,
  type,
  title,
  description,
  suggestions,
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
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Suggestions
              </p>
              <ul className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-primary mt-1">→</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
