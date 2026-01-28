import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Package, 
  Search, 
  Filter,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Users,
  UserCheck,
  UserX
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
import { StageBadge } from "@/components/stage-badge";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Transaction, TransactionStage } from "@shared/schema";
import { format } from "date-fns";

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<TransactionStage | "all">("all");
  const [sortBy, setSortBy] = useState<"date" | "value">("date");

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  if (isLoading) {
    return <LoadingState message="Loading transactions..." />;
  }

  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = 
        t.dealId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.destinationCountry.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStage = stageFilter === "all" || t.stage === stageFilter;
      return matchesSearch && matchesStage;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.valueUsd - a.valueUsd;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Transactions</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your GSM-102 export transactions
          </p>
        </div>
        <Link href="/transactions/new">
          <Button data-testid="button-new-transaction">
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Deal ID, product, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-transactions"
              />
            </div>
            <div className="flex gap-2">
              <Select value={stageFilter} onValueChange={(v) => setStageFilter(v as TransactionStage | "all")}>
                <SelectTrigger className="w-[140px]" data-testid="select-stage-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="application">Application</SelectItem>
                  <SelectItem value="approval">Approval</SelectItem>
                  <SelectItem value="shipment">Shipment</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "date" | "value")}>
                <SelectTrigger className="w-[130px]" data-testid="select-sort">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">By Date</SelectItem>
                  <SelectItem value="value">By Value</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {filteredTransactions.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                icon={Package}
                title="No transactions found"
                description={searchQuery || stageFilter !== "all" 
                  ? "Try adjusting your search or filter criteria." 
                  : "Create your first GSM-102 export transaction to get started."}
                action={!searchQuery && stageFilter === "all" ? {
                  label: "Create Transaction",
                  onClick: () => window.location.href = "/transactions/new"
                } : undefined}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Partners</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id}
                      className="hover-elevate cursor-pointer"
                      data-testid={`transaction-row-${transaction.id}`}
                    >
                      <TableCell className="font-medium">
                        <Link href={`/transactions/${transaction.id}`}>
                          <span className="text-primary hover:underline">
                            {transaction.dealId}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>{transaction.product}</TableCell>
                      <TableCell>{transaction.destinationCountry}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${transaction.valueUsd.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5">
                              {transaction.exporterUserId && transaction.importerUserId ? (
                                <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-600">
                                  <UserCheck className="h-3 w-3" />
                                  Linked
                                </Badge>
                              ) : transaction.exporterUserId || transaction.importerUserId ? (
                                <Badge variant="secondary" className="gap-1">
                                  <Users className="h-3 w-3" />
                                  Partial
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1 text-muted-foreground">
                                  <UserX className="h-3 w-3" />
                                  Unlinked
                                </Badge>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {transaction.exporterUserId && transaction.importerUserId 
                              ? "Both exporter and importer are linked" 
                              : transaction.exporterUserId 
                                ? "Waiting for importer to join" 
                                : transaction.importerUserId 
                                  ? "Waiting for exporter to link" 
                                  : "No users linked yet"}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <StageBadge stage={transaction.stage} size="sm" />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(transaction.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-actions-${transaction.id}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/transactions/${transaction.id}`}>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </Link>
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
