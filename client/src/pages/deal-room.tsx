import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  FolderOpen, 
  FileText, 
  Building2, 
  Ship, 
  DollarSign, 
  CheckCircle2, 
  ClipboardList,
  ChevronRight,
  ChevronDown,
  Download,
  Globe,
  Shield,
  Package,
  Layers,
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { EmailDialog } from "@/components/email-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Transaction, Document } from "@shared/schema";
import { DOCUMENT_TYPE_LABELS } from "@shared/schema";

interface DealRoomFolder {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  documentTypes: string[];
  subfolders?: { name: string; types: string[] }[];
}

const DEAL_ROOM_STRUCTURE: DealRoomFolder[] = [
  {
    id: "templates",
    name: "00 - Master Templates",
    icon: <Layers className="h-4 w-4" />,
    description: "Sales contracts, LC language, bank intro packs, GSM-102 process guides",
    documentTypes: [],
    subfolders: [
      { name: "Sales Contract", types: [] },
      { name: "LC Language", types: ["letter_of_credit"] },
      { name: "Bank Intro Pack", types: [] },
      { name: "GSM-102 Process Guide", types: ["usda_form"] }
    ]
  },
  {
    id: "importer",
    name: "01 - Importer",
    icon: <Building2 className="h-4 w-4" />,
    description: "Corporate docs, import licenses, regulatory approvals, cold storage proof",
    documentTypes: [],
    subfolders: [
      { name: "Corporate Docs", types: [] },
      { name: "Import Licenses", types: [] },
      { name: "Regulatory Approvals", types: ["health_certificate"] },
      { name: "Cold Storage Proof", types: [] }
    ]
  },
  {
    id: "banking",
    name: "02 - Banking",
    icon: <DollarSign className="h-4 w-4" />,
    description: "LC drafts, bank approvals, SWIFT messages, GSM-102 guarantee",
    documentTypes: ["letter_of_credit"],
    subfolders: [
      { name: "LC Drafts", types: ["letter_of_credit"] },
      { name: "Bank Approvals", types: [] },
      { name: "Swift Messages", types: [] },
      { name: "GSM-102 Guarantee", types: ["usda_form", "commodity_certificate"] }
    ]
  },
  {
    id: "compliance",
    name: "03 - Compliance",
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: "Product registrations, health certificates, labeling proof, import permits",
    documentTypes: ["health_certificate", "certificate_of_origin"],
    subfolders: [
      { name: "Product Registrations", types: [] },
      { name: "Health Certificates", types: ["health_certificate"] },
      { name: "Labeling Proof", types: [] },
      { name: "Import Permits", types: [] }
    ]
  },
  {
    id: "shipping",
    name: "04 - Shipping",
    icon: <Ship className="h-4 w-4" />,
    description: "Commercial invoice, packing list, bill of lading, insurance, vessel info",
    documentTypes: ["commercial_invoice", "packing_list", "bill_of_lading", "insurance_certificate"],
    subfolders: [
      { name: "Commercial Invoice", types: ["commercial_invoice"] },
      { name: "Packing List", types: ["packing_list"] },
      { name: "Bill of Lading", types: ["bill_of_lading"] },
      { name: "Insurance", types: ["insurance_certificate"] },
      { name: "Vessel Info", types: [] }
    ]
  },
  {
    id: "financials",
    name: "05 - Financials",
    icon: <ClipboardList className="h-4 w-4" />,
    description: "Broker invoices, commission agreements, payment confirmations",
    documentTypes: [],
    subfolders: [
      { name: "Broker Invoices", types: [] },
      { name: "Commission Agreements", types: [] },
      { name: "Payment Confirmations", types: [] }
    ]
  },
  {
    id: "status",
    name: "06 - Status & Tracking",
    icon: <Globe className="h-4 w-4" />,
    description: "Deal dashboard, timeline, issue log",
    documentTypes: [],
    subfolders: [
      { name: "Deal Dashboard", types: [] },
      { name: "Timeline", types: [] },
      { name: "Issue Log", types: [] }
    ]
  }
];

export default function DealRoomPage() {
  const { toast } = useToast();
  const [selectedTransaction, setSelectedTransaction] = useState<string>("");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    templates: true,
    banking: true,
    shipping: true
  });

  const { data: transactions = [], isLoading: loadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"]
  });

  const { data: documents = [], isLoading: loadingDocuments } = useQuery<Document[]>({
    queryKey: ["/api/documents"]
  });

  const transaction = transactions.find(t => t.id === selectedTransaction);
  const transactionDocs = documents.filter(d => d.transactionId === selectedTransaction);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const getDocsForFolder = (folder: DealRoomFolder) => {
    return transactionDocs.filter(doc => folder.documentTypes.includes(doc.type));
  };

  const getDocsForSubfolder = (types: string[]) => {
    return transactionDocs.filter(doc => types.includes(doc.type));
  };

  const getTotalDocsInFolder = (folder: DealRoomFolder) => {
    let count = folder.documentTypes.length > 0 
      ? transactionDocs.filter(doc => folder.documentTypes.includes(doc.type)).length
      : 0;
    
    if (folder.subfolders) {
      folder.subfolders.forEach(sub => {
        count += transactionDocs.filter(doc => sub.types.includes(doc.type)).length;
      });
    }
    return count;
  };

  const totalDocs = transactionDocs.length;
  const verifiedDocs = transactionDocs.filter(d => d.status === "verified").length;
  const completionPercentage = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 0;

  if (loadingTransactions) {
    return <LoadingState message="Loading deal room..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Deal Room</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Organized document structure for GSM-102 transactions
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Transaction Documents</CardTitle>
                <CardDescription>Select a transaction to view its deal room</CardDescription>
              </div>
            </div>
            <Select value={selectedTransaction} onValueChange={setSelectedTransaction}>
              <SelectTrigger className="w-[280px]" data-testid="select-deal-room-transaction">
                <SelectValue placeholder="Select transaction" />
              </SelectTrigger>
              <SelectContent>
                {transactions.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.dealId} - {t.product} ({t.destinationCountry})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {!selectedTransaction ? (
        <EmptyState
          icon={FolderOpen}
          title="Select a Transaction"
          description="Choose a transaction above to view its organized deal room documents"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {DEAL_ROOM_STRUCTURE.map(folder => {
              const isExpanded = expandedFolders[folder.id];
              const folderDocs = getDocsForFolder(folder);
              const totalInFolder = getTotalDocsInFolder(folder);
              
              return (
                <Card key={folder.id} className="overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleFolder(folder.id)}
                    data-testid={`folder-${folder.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {folder.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{folder.name}</h3>
                        <p className="text-xs text-muted-foreground">{folder.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {totalInFolder > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {totalInFolder} doc{totalInFolder !== 1 ? "s" : ""}
                        </Badge>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {isExpanded && folder.subfolders && (
                    <div className="border-t border-border">
                      {folder.subfolders.map((subfolder, idx) => {
                        const subDocs = getDocsForSubfolder(subfolder.types);
                        
                        return (
                          <div 
                            key={idx}
                            className="flex items-center justify-between px-4 py-3 pl-14 border-b border-border last:border-b-0 hover:bg-muted/30"
                          >
                            <div className="flex items-center gap-2">
                              <FolderOpen className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{subfolder.name}</span>
                            </div>
                            {subDocs.length > 0 ? (
                              <div className="flex items-center gap-2">
                                {subDocs.map(doc => (
                                  <Badge 
                                    key={doc.id} 
                                    variant="outline" 
                                    className={`text-xs ${
                                      doc.status === "verified" 
                                        ? "border-green-500/30 text-green-500" 
                                        : "border-amber-500/30 text-amber-500"
                                    }`}
                                  >
                                    <FileText className="h-3 w-3 mr-1" />
                                    {doc.fileName.slice(0, 15)}...
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">No files</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {isExpanded && folderDocs.length > 0 && !folder.subfolders && (
                    <div className="border-t border-border p-4 space-y-2">
                      {folderDocs.map(doc => (
                        <div 
                          key={doc.id}
                          className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-muted/30"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium">{doc.fileName}</p>
                              <p className="text-xs text-muted-foreground">
                                {DOCUMENT_TYPE_LABELS[doc.type]}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                doc.status === "verified" 
                                  ? "border-green-500/30 text-green-500" 
                                  : "border-amber-500/30 text-amber-500"
                              }`}
                            >
                              {doc.status}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                const link = window.document.createElement('a');
                                link.href = `/api/documents/${doc.id}/download`;
                                link.download = doc.fileName;
                                window.document.body.appendChild(link);
                                link.click();
                                window.document.body.removeChild(link);
                                toast({
                                  title: "Download Started",
                                  description: `Downloading ${doc.fileName}...`,
                                });
                              }}
                              data-testid={`button-download-${doc.id}`}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Deal Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deal ID</span>
                    <span className="font-medium">{transaction?.dealId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Product</span>
                    <span className="font-medium">{transaction?.product}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Country</span>
                    <span className="font-medium">{transaction?.destinationCountry}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Value</span>
                    <span className="font-medium">${transaction?.valueUsd.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Button 
                    className="w-full"
                    onClick={() => {
                      const link = window.document.createElement('a');
                      link.href = `/api/transactions/${selectedTransaction}/download-all`;
                      link.download = `${transaction?.dealId}_complete_package.txt`;
                      window.document.body.appendChild(link);
                      link.click();
                      window.document.body.removeChild(link);
                      toast({
                        title: "Download Started",
                        description: "Downloading complete document package for officials...",
                      });
                    }}
                    data-testid="button-download-package"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download All for Officials
                  </Button>
                  <EmailDialog 
                    transactionId={selectedTransaction} 
                    dealId={transaction?.dealId || ""} 
                    trigger={
                      <Button variant="outline" className="w-full" data-testid="button-email-officials">
                        <Mail className="h-4 w-4 mr-2" />
                        Email to Officials
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Document Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completion</span>
                  <span className="text-sm font-medium">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-primary">{totalDocs}</p>
                    <p className="text-xs text-muted-foreground">Total Docs</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-green-500">{verifiedDocs}</p>
                    <p className="text-xs text-muted-foreground">Verified</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Deal Room Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    No file = no progress
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    No compliance docs = no shipment
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    No LC issued = no production
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Structure = control
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
