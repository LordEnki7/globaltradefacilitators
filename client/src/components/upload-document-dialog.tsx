import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Upload, FileText, X, Shield, Paperclip } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Transaction, DocumentType } from "@shared/schema";
import { DOCUMENT_TYPE_LABELS, documentTypeEnum } from "@shared/schema";

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId?: string;
  preselectedDocType?: DocumentType;
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
  transactionId: initialTransactionId,
  preselectedDocType
}: UploadDocumentDialogProps) {
  const [selectedTransaction, setSelectedTransaction] = useState(initialTransactionId || "");
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | "">(preselectedDocType || "");
  const [fileName, setFileName] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: { transactionId: string; type: DocumentType; fileName: string; notes: string }) => {
      const response = await apiRequest("POST", "/api/documents", {
        ...data,
        uploadedBy: "current-user"
      });
      
      await apiRequest("POST", "/api/documents/auto-complete", {
        transactionId: data.transactionId,
        documentType: data.type
      });
      
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/checklists", variables.transactionId] });
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded and related checklist items have been auto-completed.",
      });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    if (!initialTransactionId) setSelectedTransaction("");
    if (!preselectedDocType) setSelectedDocType("");
    setFileName("");
    setNotes("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!fileName) {
        setFileName(file.name);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      if (!fileName) {
        setFileName(file.name);
      }
    }
  };

  const handleUpload = () => {
    const txnId = initialTransactionId || selectedTransaction;
    const docType = preselectedDocType || selectedDocType;
    
    if (!txnId || !docType || !fileName) return;
    
    uploadMutation.mutate({
      transactionId: txnId,
      type: docType as DocumentType,
      fileName,
      notes
    });
  };

  const isValid = (initialTransactionId || selectedTransaction) && 
                  (preselectedDocType || selectedDocType) && 
                  fileName;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload Document
          </DialogTitle>
          <DialogDescription>
            Add a new document to a transaction. All documents are securely encrypted using AES-256.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!initialTransactionId && (
            <div className="space-y-2">
              <Label htmlFor="transaction">Transaction *</Label>
              <Select value={selectedTransaction} onValueChange={setSelectedTransaction}>
                <SelectTrigger data-testid="select-upload-transaction">
                  <SelectValue placeholder="Select a transaction" />
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
          )}

          {!preselectedDocType && (
            <div className="space-y-2">
              <Label htmlFor="docType">Document Type *</Label>
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
          )}

          <div className="space-y-2">
            <Label>File *</Label>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              data-testid="input-file"
            />
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              data-testid="dropzone-file"
            >
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Paperclip className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Click to select or drag & drop</p>
                    <p className="text-xs text-muted-foreground">
                      PDF, Word, Excel, or images up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileName">Document Name *</Label>
            <Input
              id="fileName"
              placeholder="e.g., LC_Nigeria_2025.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              data-testid="input-file-name"
            />
            <p className="text-xs text-muted-foreground">
              This name will be used to identify the document in the system.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any relevant notes about this document..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              data-testid="input-notes"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Shield className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Documents are encrypted using AES-256 encryption and stored securely. 
              Only authorized users can access uploaded documents.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!isValid || uploadMutation.isPending}
            data-testid="button-confirm-upload"
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
