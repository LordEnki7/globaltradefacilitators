import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  FolderCheck, 
  Search, 
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ComplianceStatusBadge } from "@/components/compliance-status-badge";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ComplianceItem, Transaction, ComplianceStatus } from "@shared/schema";
import { format } from "date-fns";

export default function CompliancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | "all">("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const { toast } = useToast();

  const { data: complianceItems = [], isLoading } = useQuery<ComplianceItem[]>({
    queryKey: ["/api/compliance"],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const addMutation = useMutation({
    mutationFn: async (data: { transactionId: string; name: string; description: string; dueDate: string | null }) => {
      return apiRequest("POST", "/api/compliance", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/compliance"] });
      toast({
        title: "Item Added",
        description: "Compliance item has been added successfully.",
      });
      setAddDialogOpen(false);
      setSelectedTransaction("");
      setItemName("");
      setItemDescription("");
      setDueDate("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add compliance item.",
        variant: "destructive",
      });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ComplianceStatus }) => {
      return apiRequest("PATCH", `/api/compliance/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/compliance"] });
      toast({
        title: "Status Updated",
        description: "Compliance item status has been updated.",
      });
    }
  });

  if (isLoading) {
    return <LoadingState message="Loading compliance items..." />;
  }

  const getTransactionDealId = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    return transaction?.dealId || transactionId;
  };

  const filteredItems = complianceItems
    .filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getTransactionDealId(item.transactionId).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (a.status === "overdue" && b.status !== "overdue") return -1;
      if (b.status === "overdue" && a.status !== "overdue") return 1;
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

  const stats = {
    total: complianceItems.length,
    pending: complianceItems.filter(c => c.status === "pending").length,
    inProgress: complianceItems.filter(c => c.status === "in_progress").length,
    completed: complianceItems.filter(c => c.status === "completed").length,
    overdue: complianceItems.filter(c => c.status === "overdue").length,
  };

  const handleAdd = () => {
    if (!selectedTransaction || !itemName) return;
    addMutation.mutate({
      transactionId: selectedTransaction,
      name: itemName,
      description: itemDescription,
      dueDate: dueDate || null
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Compliance</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track certifications and regulatory requirements
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-compliance">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Compliance Item</DialogTitle>
              <DialogDescription>
                Add a new compliance requirement to track.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="transaction">Transaction</Label>
                <Select value={selectedTransaction} onValueChange={setSelectedTransaction}>
                  <SelectTrigger data-testid="select-compliance-transaction">
                    <SelectValue placeholder="Select transaction" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactions.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.dealId} - {t.product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  placeholder="e.g., NAFDAC Approval"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  data-testid="input-compliance-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about this requirement..."
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="resize-none"
                  rows={2}
                  data-testid="input-compliance-description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  data-testid="input-compliance-due-date"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAdd} 
                disabled={!selectedTransaction || !itemName || addMutation.isPending}
                data-testid="button-confirm-add"
              >
                {addMutation.isPending ? "Adding..." : "Add Item"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-elevate cursor-default">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <FolderCheck className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-default">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-default">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-default">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.overdue}</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search compliance items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-compliance"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ComplianceStatus | "all")}>
              <SelectTrigger className="w-[140px]" data-testid="select-compliance-filter">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {filteredItems.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                icon={FolderCheck}
                title="No compliance items found"
                description={searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria." 
                  : "Add your first compliance item to start tracking."}
                action={!searchQuery && statusFilter === "all" ? {
                  label: "Add Compliance Item",
                  onClick: () => setAddDialogOpen(true)
                } : undefined}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow 
                      key={item.id}
                      className="hover-elevate"
                      data-testid={`compliance-row-${item.id}`}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/transactions/${item.transactionId}`}>
                          <span className="text-primary hover:underline">
                            {getTransactionDealId(item.transactionId)}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <ComplianceStatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.dueDate ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(item.dueDate), "MMM d, yyyy")}
                          </div>
                        ) : (
                          <span className="text-xs">No due date</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {item.status !== "in_progress" && item.status !== "completed" && (
                              <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: item.id, status: "in_progress" })}>
                                <Clock className="h-4 w-4 mr-2" />
                                Mark In Progress
                              </DropdownMenuItem>
                            )}
                            {item.status !== "completed" && (
                              <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: item.id, status: "completed" })}>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark Complete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
