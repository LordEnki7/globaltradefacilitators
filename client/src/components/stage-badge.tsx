import { Badge } from "@/components/ui/badge";
import type { TransactionStage } from "@shared/schema";
import { STAGE_LABELS } from "@shared/schema";
import { 
  FileText, 
  CheckCircle2, 
  Ship, 
  DollarSign, 
  CircleCheckBig 
} from "lucide-react";

const stageConfig: Record<TransactionStage, { 
  variant: "default" | "secondary" | "outline" | "destructive";
  className: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  application: {
    variant: "secondary",
    className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: FileText
  },
  approval: {
    variant: "secondary",
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: CheckCircle2
  },
  shipment: {
    variant: "secondary",
    className: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
    icon: Ship
  },
  payment: {
    variant: "secondary",
    className: "bg-primary/15 text-primary border-primary/20",
    icon: DollarSign
  },
  completed: {
    variant: "secondary",
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CircleCheckBig
  }
};

interface StageBadgeProps {
  stage: TransactionStage;
  showIcon?: boolean;
  size?: "sm" | "default";
}

export function StageBadge({ stage, showIcon = true, size = "default" }: StageBadgeProps) {
  const config = stageConfig[stage];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${size === "sm" ? "text-xs px-2 py-0.5" : ""} gap-1.5 font-medium border`}
      data-testid={`badge-stage-${stage}`}
    >
      {showIcon && <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />}
      {STAGE_LABELS[stage]}
    </Badge>
  );
}
