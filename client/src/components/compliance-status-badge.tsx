import { Badge } from "@/components/ui/badge";
import type { ComplianceStatus } from "@shared/schema";
import { Clock, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

const statusConfig: Record<ComplianceStatus, {
  label: string;
  className: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground border-border",
    icon: Clock
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Loader2
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2
  },
  overdue: {
    label: "Overdue",
    className: "bg-destructive/15 text-destructive border-destructive/20",
    icon: AlertTriangle
  }
};

interface ComplianceStatusBadgeProps {
  status: ComplianceStatus;
  showIcon?: boolean;
}

export function ComplianceStatusBadge({ status, showIcon = true }: ComplianceStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className={`${config.className} gap-1.5 font-medium border`}
      data-testid={`badge-compliance-${status}`}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
