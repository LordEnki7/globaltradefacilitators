import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Package, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  DollarSign,
  ArrowRight,
  Clock,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { StageBadge } from "@/components/stage-badge";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { StageProgress } from "@/components/stage-progress";
import type { Transaction, Notification, Document, ComplianceItem } from "@shared/schema";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: transactions = [], isLoading: loadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const { data: complianceItems = [] } = useQuery<ComplianceItem[]>({
    queryKey: ["/api/compliance"],
  });

  if (loadingTransactions) {
    return <LoadingState message="Loading dashboard..." />;
  }

  const activeTransactions = transactions.filter(t => t.stage !== "completed");
  const completedTransactions = transactions.filter(t => t.stage === "completed");
  const totalValue = transactions.reduce((sum, t) => sum + t.valueUsd, 0);
  const pendingDocuments = documents.filter(d => d.status === "pending" || d.status === "uploaded").length;
  const overdueCompliance = complianceItems.filter(c => c.status === "overdue").length;
  const unreadNotifications = notifications.filter(n => !n.isRead);

  const stageDistribution = {
    application: transactions.filter(t => t.stage === "application").length,
    approval: transactions.filter(t => t.stage === "approval").length,
    shipment: transactions.filter(t => t.stage === "shipment").length,
    payment: transactions.filter(t => t.stage === "payment").length,
    completed: completedTransactions.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            GSM-102 Export Credit Guarantee Overview
          </p>
        </div>
        <Link href="/transactions/new">
          <Button data-testid="button-new-transaction">
            <Package className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Deals"
          value={activeTransactions.length}
          subtitle={`${completedTransactions.length} completed`}
          icon={Package}
        />
        <StatCard
          title="Total Value"
          value={`$${totalValue.toLocaleString()}`}
          subtitle="Across all transactions"
          icon={DollarSign}
          iconClassName="bg-emerald-500/10 text-emerald-500"
        />
        <StatCard
          title="Pending Documents"
          value={pendingDocuments}
          subtitle="Awaiting verification"
          icon={FileText}
          iconClassName="bg-amber-500/10 text-amber-500"
        />
        <StatCard
          title="Alerts"
          value={overdueCompliance + unreadNotifications.length}
          subtitle={`${overdueCompliance} overdue items`}
          icon={AlertTriangle}
          iconClassName="bg-destructive/10 text-destructive"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-base font-semibold">Pipeline Overview</CardTitle>
            <Link href="/transactions">
              <Button variant="ghost" size="sm" data-testid="button-view-all-transactions">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-5 gap-4">
              {(["application", "approval", "shipment", "payment", "completed"] as const).map((stage) => (
                <div 
                  key={stage} 
                  className="text-center p-4 rounded-lg bg-muted/50 border border-border/50"
                  data-testid={`pipeline-stage-${stage}`}
                >
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {stageDistribution[stage]}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {stage}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/transactions/new">
              <Button variant="outline" className="w-full justify-start" data-testid="button-quick-new-deal">
                <Package className="h-4 w-4 mr-2" />
                Create New Deal
              </Button>
            </Link>
            <Link href="/documents">
              <Button variant="outline" className="w-full justify-start" data-testid="button-quick-documents">
                <FileText className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </Link>
            <Link href="/compliance">
              <Button variant="outline" className="w-full justify-start" data-testid="button-quick-compliance">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Review Compliance
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No transactions yet"
                description="Create your first GSM-102 export transaction to get started."
                action={{
                  label: "Create Transaction",
                  onClick: () => window.location.href = "/transactions/new"
                }}
              />
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <Link key={transaction.id} href={`/transactions/${transaction.id}`}>
                    <div 
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover-elevate cursor-pointer"
                      data-testid={`transaction-row-${transaction.id}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">
                            {transaction.dealId}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {transaction.product} • {transaction.destinationCountry}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-medium text-foreground">
                            ${transaction.valueUsd.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.createdAt), "MMM d")}
                          </p>
                        </div>
                        <StageBadge stage={transaction.stage} size="sm" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-base font-semibold">Recent Notifications</CardTitle>
            <Link href="/notifications">
              <Button variant="ghost" size="sm" data-testid="button-view-all-notifications">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 4).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.isRead 
                        ? "border-border bg-transparent" 
                        : "border-primary/30 bg-primary/5"
                    }`}
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        notification.isRead ? "bg-muted" : "bg-primary"
                      }`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
