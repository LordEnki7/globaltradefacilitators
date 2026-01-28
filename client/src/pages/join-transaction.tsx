import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link2, Package, DollarSign, Globe, Building2, CheckCircle2, AlertCircle, ArrowRight, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LoadingState } from "@/components/loading-state";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface TransactionPreview {
  id: string;
  dealId: string;
  product: string;
  quantity: string;
  valueUsd: number;
  destinationCountry: string;
  exporterId: string;
  hasImporter: boolean;
}

export default function JoinTransactionPage() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const urlParams = new URLSearchParams(searchString);
  const codeFromUrl = urlParams.get("code") || "";
  
  const [linkCode, setLinkCode] = useState(codeFromUrl);
  const [isSearching, setIsSearching] = useState(false);
  const [transactionPreview, setTransactionPreview] = useState<TransactionPreview | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    if (codeFromUrl) {
      handleLookup(codeFromUrl);
    }
  }, [codeFromUrl]);

  const handleLookup = async (code: string) => {
    if (!code.trim()) return;
    
    setIsSearching(true);
    setLookupError(null);
    setTransactionPreview(null);

    try {
      const response = await fetch(`/api/transactions/link/${code.toUpperCase()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Transaction not found");
      }
      const data = await response.json();
      setTransactionPreview(data);
    } catch (error) {
      setLookupError((error as Error).message);
    } finally {
      setIsSearching(false);
    }
  };

  const joinMutation = useMutation({
    mutationFn: async () => {
      if (!transactionPreview || !user) return;
      return apiRequest("POST", `/api/transactions/${transactionPreview.id}/link-importer`, {
        importerUserId: user.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-transactions"] });
      toast({
        title: "Successfully Joined",
        description: "You have been linked to this transaction as the importer.",
      });
      navigate(`/transactions/${transactionPreview?.id}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to Join",
        description: (error as Error).message || "Could not join transaction.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(linkCode);
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <Link2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Join a Transaction</h1>
        <p className="text-muted-foreground">
          Enter the code shared by your export partner to join their transaction.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Enter Link Code</CardTitle>
          <CardDescription>
            The code looks like GTF-XXXXXX (6 characters after GTF-)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-code">Transaction Link Code</Label>
              <div className="flex gap-2">
                <Input
                  id="link-code"
                  placeholder="GTF-XXXXXX"
                  value={linkCode}
                  onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
                  className="font-mono text-lg tracking-wider"
                  data-testid="input-join-link-code"
                />
                <Button type="submit" disabled={isSearching} data-testid="button-lookup-transaction">
                  {isSearching ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {lookupError && (
        <Card className="border-destructive/50 bg-destructive/5 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive">Transaction Not Found</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {lookupError}. Please check the code and try again.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {transactionPreview && (
        <Card className="border-primary/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Transaction Found</CardTitle>
              <span className="text-sm font-mono text-muted-foreground">{transactionPreview.dealId}</span>
            </div>
            <CardDescription>
              Review the transaction details below before joining.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium">{transactionPreview.product}</p>
                  <p className="text-sm text-muted-foreground">{transactionPreview.quantity}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="font-medium">${transactionPreview.valueUsd.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium">{transactionPreview.destinationCountry}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Exporter</p>
                  <p className="font-medium">{transactionPreview.exporterId}</p>
                </div>
              </div>
            </div>

            <Separator />

            {transactionPreview.hasImporter ? (
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-500/10 p-4 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Transaction Already Has an Importer</p>
                  <p className="text-sm">Another importer has already joined this transaction.</p>
                </div>
              </div>
            ) : user?.role === "importer" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-500/10 p-4 rounded-lg">
                  <CheckCircle2 className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Ready to Join</p>
                    <p className="text-sm">You can join this transaction as the importer.</p>
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => joinMutation.mutate()}
                  disabled={joinMutation.isPending}
                  data-testid="button-join-transaction"
                >
                  {joinMutation.isPending ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-2" />
                  )}
                  Join This Transaction
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 p-4 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Importer Role Required</p>
                  <p className="text-sm">Only users with the Importer role can join transactions.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
