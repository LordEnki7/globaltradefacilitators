import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { 
  ArrowLeft, 
  Package, 
  Building2, 
  FileText, 
  Globe,
  DollarSign,
  Calendar,
  Ship,
  Upload,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StageBadge } from "@/components/stage-badge";
import { StageProgress } from "@/components/stage-progress";
import { DocumentStatusBadge } from "@/components/document-status-badge";
import { ComplianceStatusBadge } from "@/components/compliance-status-badge";
import { UploadDocumentDialog } from "@/components/upload-document-dialog";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Transaction, Document, ComplianceItem, TransactionStage, DocumentType } from "@shared/schema";
import { DOCUMENT_TYPE_LABELS, REQUIRED_DOCUMENTS_BY_STAGE, STAGE_LABELS } from "@shared/schema";
import { format } from "date-fns";

export default function TransactionDetailPage() {
  const [, params] = useRoute("/transactions/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const transactionId = params?.id;
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState<DocumentType | undefined>(undefined);

  const { data: transaction, isLoading: loadingTransaction } = useQuery<Transaction>({
    queryKey: ["/api/transactions", transactionId],
    enabled: !!transactionId,
  });

  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    enabled: !!transactionId,
  });

  const { data: complianceItems = [] } = useQuery<ComplianceItem[]>({
    queryKey: ["/api/compliance"],
    enabled: !!transactionId,
  });

  const advanceStageMutation = useMutation({
    mutationFn: async (newStage: TransactionStage) => {
      return apiRequest("PATCH", `/api/transactions/${transactionId}/stage`, { stage: newStage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions", transactionId] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Stage Updated",
        description: "Transaction stage has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update stage.",
        variant: "destructive",
      });
    }
  });

  if (loadingTransaction) {
    return <LoadingState message="Loading transaction details..." />;
  }

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">Transaction Not Found</h2>
        <p className="text-muted-foreground mb-6">The transaction you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/transactions")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Transactions
        </Button>
      </div>
    );
  }

  const stages: TransactionStage[] = ["application", "approval", "shipment", "payment", "completed"];
  const currentStageIndex = stages.indexOf(transaction.stage);
  const nextStage = currentStageIndex < stages.length - 1 ? stages[currentStageIndex + 1] : null;

  const requiredDocs = REQUIRED_DOCUMENTS_BY_STAGE[transaction.stage] || [];
  const transactionDocs = documents.filter(d => d.transactionId === transactionId);
  const uploadedDocTypes = new Set(transactionDocs.map(d => d.type));
  const missingDocs = requiredDocs.filter(type => !uploadedDocTypes.has(type));

  const transactionCompliance = complianceItems.filter(c => c.transactionId === transactionId);
  const completedCompliance = transactionCompliance.filter(c => c.status === "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/transactions")} data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {transaction.dealId}
              </h1>
              <StageBadge stage={transaction.stage} />
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              {transaction.product} to {transaction.destinationCountry}
            </p>
          </div>
        </div>
        {nextStage && (
          <Button 
            onClick={() => advanceStageMutation.mutate(nextStage)}
            disabled={advanceStageMutation.isPending}
            data-testid="button-advance-stage"
          >
            Advance to {STAGE_LABELS[nextStage]}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <StageProgress currentStage={transaction.stage} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="documents" data-testid="tab-documents">
                Documents
                {missingDocs.length > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1.5">
                    {missingDocs.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="compliance" data-testid="tab-compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Deal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Product</p>
                          <p className="text-sm font-medium">{transaction.product}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Value</p>
                          <p className="text-sm font-medium">${transaction.valueUsd.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Destination</p>
                          <p className="text-sm font-medium">{transaction.destinationCountry}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Quantity</p>
                          <p className="text-sm font-medium">{transaction.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Incoterms</p>
                          <p className="text-sm font-medium">{transaction.incoterms}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Created</p>
                          <p className="text-sm font-medium">{format(new Date(transaction.createdAt), "MMMM d, yyyy")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Banking Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Exporter Bank (US)</p>
                          <p className="text-sm font-medium">{transaction.exporterBank}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">LC Number</p>
                          <p className="text-sm font-medium">{transaction.lcNumber || "Not issued"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Importer Bank</p>
                          <p className="text-sm font-medium">{transaction.importerBank}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">LC Tenor</p>
                          <p className="text-sm font-medium">{transaction.lcTenor}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {(transaction.etd || transaction.eta) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Shipping Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {transaction.etd && (
                        <div className="flex items-center gap-3">
                          <Ship className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">ETD</p>
                            <p className="text-sm font-medium">{format(new Date(transaction.etd), "MMMM d, yyyy")}</p>
                          </div>
                        </div>
                      )}
                      {transaction.eta && (
                        <div className="flex items-center gap-3">
                          <Ship className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">ETA</p>
                            <p className="text-sm font-medium">{format(new Date(transaction.eta), "MMMM d, yyyy")}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <div>
                    <CardTitle className="text-base">Required Documents</CardTitle>
                    <CardDescription>
                      Documents needed for the {STAGE_LABELS[transaction.stage]} stage
                    </CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    data-testid="button-upload-document"
                    onClick={() => {
                      setUploadDocType(undefined);
                      setUploadDialogOpen(true);
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </CardHeader>
                <CardContent>
                  {requiredDocs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                      <p>No documents required for this stage</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {requiredDocs.map((docType) => {
                        const doc = transactionDocs.find(d => d.type === docType);
                        return (
                          <div 
                            key={docType}
                            className="flex items-center justify-between p-3 rounded-lg border border-border"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{DOCUMENT_TYPE_LABELS[docType]}</p>
                                {doc && (
                                  <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                                )}
                              </div>
                            </div>
                            {doc ? (
                              <DocumentStatusBadge status={doc.status} />
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                onClick={() => {
                                  setUploadDocType(docType);
                                  setUploadDialogOpen(true);
                                }}
                                data-testid={`button-upload-${docType}`}
                              >
                                <Upload className="h-3 w-3 mr-1" />
                                Upload
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
              <UploadDocumentDialog 
                open={uploadDialogOpen} 
                onOpenChange={setUploadDialogOpen}
                transactionId={transactionId}
                preselectedDocType={uploadDocType}
              />
            </TabsContent>

            <TabsContent value="compliance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Compliance Checklist</CardTitle>
                  <CardDescription>
                    Track required certifications and regulatory items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transactionCompliance.length === 0 ? (
                    <EmptyState
                      icon={CheckCircle2}
                      title="No compliance items"
                      description="Compliance items will be added as the transaction progresses."
                    />
                  ) : (
                    <div className="space-y-3">
                      {transactionCompliance.map((item) => (
                        <div 
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              {item.description && (
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              )}
                              {item.dueDate && (
                                <p className="text-xs text-muted-foreground">
                                  Due: {format(new Date(item.dueDate), "MMM d, yyyy")}
                                </p>
                              )}
                            </div>
                          </div>
                          <ComplianceStatusBadge status={item.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Documents</span>
                <span className="text-sm font-medium">
                  {transactionDocs.length}/{requiredDocs.length} uploaded
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${requiredDocs.length ? (transactionDocs.length / requiredDocs.length) * 100 : 100}%` }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Compliance</span>
                <span className="text-sm font-medium">
                  {completedCompliance}/{transactionCompliance.length} complete
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${transactionCompliance.length ? (completedCompliance / transactionCompliance.length) * 100 : 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {missingDocs.length > 0 && (
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-5 w-5" />
                  Missing Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {missingDocs.map((docType) => (
                    <li key={docType} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {DOCUMENT_TYPE_LABELS[docType]}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {transaction.notes && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{transaction.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
