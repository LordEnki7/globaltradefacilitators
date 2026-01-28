import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Copy, Mail, Share2, Check, Users, Send, Loader2 } from "lucide-react";
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
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import type { Transaction } from "@shared/schema";

interface ShareTransactionDialogProps {
  transaction: Transaction;
  trigger?: React.ReactNode;
}

export function ShareTransactionDialog({ transaction, trigger }: ShareTransactionDialogProps) {
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
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

  const sendInviteMutation = useMutation({
    mutationFn: async () => {
      const senderName = user?.firstName && user?.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user?.email || "An exporter";
      return apiRequest("POST", `/api/transactions/${transaction.id}/invite`, {
        email: inviteEmail,
        senderName
      });
    },
    onSuccess: () => {
      toast({
        title: "Invitation Sent",
        description: `An invitation email has been sent to ${inviteEmail}`,
      });
      setInviteEmail("");
    },
    onError: (error) => {
      toast({
        title: "Failed to Send",
        description: (error as Error).message || "Could not send invitation email.",
        variant: "destructive",
      });
    }
  });

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    sendInviteMutation.mutate();
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
            <Label>Copy direct link</Label>
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

          <Separator />

          <form onSubmit={handleSendInvite} className="space-y-2">
            <Label htmlFor="invite-email">Send email invitation</Label>
            <div className="flex gap-2">
              <Input
                id="invite-email"
                type="email"
                placeholder="partner@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                data-testid="input-invite-email"
              />
              <Button
                type="submit"
                disabled={!inviteEmail.trim() || sendInviteMutation.isPending}
                data-testid="button-send-invite"
              >
                {sendInviteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              We'll send them an email with instructions to join.
            </p>
          </form>

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
