import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EmailDialogProps {
  transactionId: string;
  dealId: string;
  trigger?: React.ReactNode;
}

export function EmailDialog({ transactionId, dealId, trigger }: EmailDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [subject, setSubject] = useState(`GSM-102 Document Package - ${dealId}`);
  const [message, setMessage] = useState("");

  const emailMutation = useMutation({
    mutationFn: async (data: { recipientEmail: string; recipientName: string; subject: string; message: string }) => {
      return apiRequest("POST", `/api/transactions/${transactionId}/email`, data);
    },
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: `Document package sent to ${recipientEmail}`,
      });
      setOpen(false);
      setRecipientEmail("");
      setRecipientName("");
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Failed to Send Email",
        description: "Please check the email address and try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) {
      toast({
        title: "Email Required",
        description: "Please enter a recipient email address.",
        variant: "destructive",
      });
      return;
    }
    emailMutation.mutate({ recipientEmail, recipientName, subject, message });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" data-testid="button-email-dialog">
            <Mail className="h-4 w-4 mr-2" />
            Email to Official
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Email Document Package</DialogTitle>
          <DialogDescription>
            Send the complete document package for {dealId} to an official for review.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipientEmail">Recipient Email *</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="official@agency.gov"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
                data-testid="input-recipient-email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                placeholder="John Smith"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                data-testid="input-recipient-name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                data-testid="input-email-subject"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Please review the attached document package..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                data-testid="input-email-message"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={emailMutation.isPending} data-testid="button-send-email">
              {emailMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
