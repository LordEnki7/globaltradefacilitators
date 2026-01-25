import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Bell, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  PackageCheck,
  MoreHorizontal,
  Check,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Notification } from "@shared/schema";
import { format } from "date-fns";

const notificationConfig: Record<Notification["type"], {
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
  bgClassName: string;
}> = {
  document_missing: {
    icon: FileText,
    iconClassName: "text-amber-500",
    bgClassName: "bg-amber-500/10"
  },
  deadline_approaching: {
    icon: Clock,
    iconClassName: "text-amber-500",
    bgClassName: "bg-amber-500/10"
  },
  stage_change: {
    icon: PackageCheck,
    iconClassName: "text-primary",
    bgClassName: "bg-primary/10"
  },
  document_verified: {
    icon: CheckCircle2,
    iconClassName: "text-emerald-500",
    bgClassName: "bg-emerald-500/10"
  },
  action_required: {
    icon: AlertTriangle,
    iconClassName: "text-destructive",
    bgClassName: "bg-destructive/10"
  }
};

export default function NotificationsPage() {
  const { toast } = useToast();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const markReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return apiRequest("PATCH", `/api/notifications/${notificationId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", "/api/notifications/read-all", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "All Marked as Read",
        description: "All notifications have been marked as read.",
      });
    }
  });

  if (isLoading) {
    return <LoadingState message="Loading notifications..." />;
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (!a.isRead && b.isRead) return -1;
    if (a.isRead && !b.isRead) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="default">{unreadCount} unread</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Stay updated on your transactions and documents
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            data-testid="button-mark-all-read"
          >
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up! Notifications will appear here when there are updates to your transactions."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedNotifications.map((notification) => {
            const config = notificationConfig[notification.type];
            const Icon = config.icon;

            return (
              <Card 
                key={notification.id}
                className={`transition-all ${!notification.isRead ? "border-primary/30 bg-primary/5" : ""}`}
                data-testid={`notification-card-${notification.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-lg flex-shrink-0 ${config.bgClassName}`}>
                      <Icon className={`h-5 w-5 ${config.iconClassName}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{notification.title}</p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                            </span>
                            {notification.transactionId && (
                              <Link href={`/transactions/${notification.transactionId}`}>
                                <span className="text-xs text-primary hover:underline">
                                  View Transaction
                                </span>
                              </Link>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="flex-shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!notification.isRead && (
                              <DropdownMenuItem onClick={() => markReadMutation.mutate(notification.id)}>
                                <Check className="h-4 w-4 mr-2" />
                                Mark as Read
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
