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
  Eye,
  Shield
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
import { DocumentStatusBadge } from "@/components/document-status-badge";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Document, Transaction, DocumentType, DocumentStatus } from "@shared/schema";
import { DOCUMENT_TYPE_LABELS, documentTypeEnum } from "@shared/schema";
import { format } from "date-fns";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "all">("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | "">("");
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: { transactionId: string; type: DocumentType; fileName: string }) => {
      return apiRequest("POST", "/api/documents", {
        ...data,
        uploadedBy: "current-user",
        notes: ""
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully.",
      });
      setUploadDialogOpen(false);
      setSelectedTransaction("");
      setSelectedDocType("");
      setFileName("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload document.",
        variant: "destructive",
      });
    }
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

  const handleUpload = () => {
    if (!selectedTransaction || !selectedDocType || !fileName) return;
    uploadMutation.mutate({
      transactionId: selectedTransaction,
      type: selectedDocType as DocumentType,
      fileName
    });
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
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-upload-document">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Add a new document to a transaction. All documents are securely encrypted.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="transaction">Transaction</Label>
                <Select value={selectedTransaction} onValueChange={setSelectedTransaction}>
                  <SelectTrigger data-testid="select-upload-transaction">
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
                <Label htmlFor="docType">Document Type</Label>
                <Select value={selectedDocType} onValueChange={(v) => setSelectedDocType(v as DocumentType)}>
                  <SelectTrigger data-testid="select-upload-type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypeEnum.options.map((type) => (
                      <SelectItem key={type} value={type}>
                        {DOCUMENT_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileName">File Name</Label>
                <Input
                  id="fileName"
                  placeholder="e.g., LC_Nigeria_2025.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  data-testid="input-file-name"
                />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                <Shield className="h-5 w-5 text-primary" />
                <p className="text-xs text-muted-foreground">
                  Documents are encrypted using AES-256 encryption and stored securely.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!selectedTransaction || !selectedDocType || !fileName || uploadMutation.isPending}
                data-testid="button-confirm-upload"
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload"}
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
