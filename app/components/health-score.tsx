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

  return (
    <div className={`glass-card p-6 rounded-xl bg-gradient-to-br ${getBgColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={getColor()}>{getIcon()}</div>
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-4xl font-bold ${getColor()}`}>{score}</span>
        <span className="text-muted-foreground mb-1">/100</span>
      </div>
      <div className="mt-4 h-2 bg-secondary/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${
            score >= 80
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
