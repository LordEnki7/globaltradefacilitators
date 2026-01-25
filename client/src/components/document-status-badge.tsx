import { Badge } from "@/components/ui/badge";
import type { DocumentStatus } from "@shared/schema";
import { Clock, Upload, CheckCircle2, XCircle } from "lucide-react";

const statusConfig: Record<DocumentStatus, {
  label: string;
  className: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground border-border",
    icon: Clock
  },
  uploaded: {
    label: "Uploaded",
    className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Upload
  },
  verified: {
    label: "Verified",
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/15 text-destructive border-destructive/20",
    icon: XCircle
  }
};

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  showIcon?: boolean;
}

export function DocumentStatusBadge({ status, showIcon = true }: DocumentStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className={`${config.className} gap-1.5 font-medium border`}
      data-testid={`badge-document-${status}`}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
