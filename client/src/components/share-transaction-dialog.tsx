import { useState } from "react";
import { Copy, Mail, Share2, Check, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@shared/schema";

interface ShareTransactionDialogProps {
  transaction: Transaction;
  trigger?: React.ReactNode;
}

export function ShareTransactionDialog({ transaction, trigger }: ShareTransactionDialogProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const linkCode = transaction.linkCode;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(linkCode);
      setCopied(true);
      toast({
        title: "Code Copied",
        description: "Share this code with your import partner.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the code.",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = async () => {
    const joinUrl = `${window.location.origin}/join-transaction?code=${linkCode}`;
    try {
      await navigator.clipboard.writeText(joinUrl);
      toast({
        title: "Link Copied",
        description: "Share this link with your import partner.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the link.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" data-testid="button-share-transaction">
            <Share2 className="h-4 w-4 mr-2" />
            Share with Importer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Share Transaction
          </DialogTitle>
          <DialogDescription>
            Share this code with your import partner so they can join this transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="link-code">Transaction Link Code</Label>
            <div className="flex gap-2">
              <Input
                id="link-code"
                value={linkCode}
                readOnly
                className="font-mono text-lg tracking-wider text-center"
                data-testid="input-link-code"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCode}
                data-testid="button-copy-code"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your partner can enter this code to join the transaction.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Or share a direct link</Label>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleCopyLink}
              data-testid="button-copy-link"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Join Link
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Transaction Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Deal ID:</span>
              <span>{transaction.dealId}</span>
              <span className="text-muted-foreground">Product:</span>
              <span>{transaction.product}</span>
              <span className="text-muted-foreground">Value:</span>
              <span>${transaction.valueUsd.toLocaleString()}</span>
              <span className="text-muted-foreground">Destination:</span>
              <span>{transaction.destinationCountry}</span>
            </div>
          </div>

          {transaction.importerUserId ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-500/10 p-3 rounded-lg">
              <Check className="h-5 w-5" />
              <span className="text-sm font-medium">Importer already linked to this transaction</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-500/10 p-3 rounded-lg">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Waiting for importer to join</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
