import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  FileText, 
  Search, 
  Filter,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  MoreHorizontal,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { DocumentStatusBadge } from "@/components/document-status-badge";
import { UploadDocumentDialog } from "@/components/upload-document-dialog";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Document, Transaction, DocumentStatus } from "@shared/schema";
import { DOCUMENT_TYPE_LABELS } from "@shared/schema";
import { format } from "date-fns";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "all">("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const verifyMutation = useMutation({
    mutationFn: async (documentId: string) => {
      return apiRequest("PATCH", `/api/documents/${documentId}/verify`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document Verified",
        description: "The document has been verified successfully.",
      });
    }
  });

  if (isLoading) {
    return <LoadingState message="Loading documents..." />;
  }

  const getTransactionDealId = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    return transaction?.dealId || transactionId;
  };

  const filteredDocuments = documents
    .filter(d => {
      const matchesSearch = 
        d.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        DOCUMENT_TYPE_LABELS[d.type].toLowerCase().includes(searchQuery.toLowerCase()) ||
        getTransactionDealId(d.transactionId).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === "pending").length,
    uploaded: documents.filter(d => d.status === "uploaded").length,
    verified: documents.filter(d => d.status === "verified").length,
    rejected: documents.filter(d => d.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Documents</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage trade documents and certifications
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)} data-testid="button-upload-document">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
        <UploadDocumentDialog 
          open={uploadDialogOpen} 
          onOpenChange={setUploadDialogOpen}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-elevate cursor-default">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Documents</p>
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
                <p className="text-2xl font-bold">{stats.uploaded}</p>
                <p className="text-xs text-muted-foreground">Awaiting Review</p>
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
                <p className="text-2xl font-bold">{stats.verified}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-default">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
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
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-documents"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as DocumentStatus | "all")}>
              <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="uploaded">Uploaded</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {filteredDocuments.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                icon={FileText}
                title="No documents found"
                description={searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria." 
                  : "Upload your first trade document to get started."}
                action={!searchQuery && statusFilter === "all" ? {
                  label: "Upload Document",
                  onClick: () => setUploadDialogOpen(true)
                } : undefined}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow 
                      key={doc.id}
                      className="hover-elevate"
                      data-testid={`document-row-${doc.id}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{doc.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-primary">
                        {getTransactionDealId(doc.transactionId)}
                      </TableCell>
                      <TableCell>{DOCUMENT_TYPE_LABELS[doc.type]}</TableCell>
                      <TableCell>
                        <DocumentStatusBadge status={doc.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(doc.uploadedAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            {doc.status === "uploaded" && (
                              <DropdownMenuItem onClick={() => verifyMutation.mutate(doc.id)}>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Verify
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
