import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Globe, ArrowRight, Building2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import logoShipMain from "../assets/logo-ship-main.png";

export default function RoleSelectionPage() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<"exporter" | "importer" | null>(null);
  const { toast } = useToast();

  const selectRoleMutation = useMutation({
    mutationFn: async (role: "exporter" | "importer") => {
      const response = await apiRequest("POST", "/api/user/select-role", { role });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Welcome!",
        description: "Your account has been set up successfully.",
      });
      setLocation("/dashboard");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to set your role. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (selectedRole) {
      selectRoleMutation.mutate(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <img
            src={logoShipMain}
            alt="Global Trade Facilitators"
            className="h-16 mx-auto"
            data-testid="img-role-logo"
          />
          <h1 className="text-3xl font-bold">Welcome to Global Trade Facilitators</h1>
          <p className="text-muted-foreground">
            Choose your role to get started with GSM-102 export credit guarantee tracking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className={`cursor-pointer transition-all hover-elevate ${
              selectedRole === "exporter"
                ? "border-primary bg-primary/5 ring-2 ring-primary"
                : ""
            }`}
            onClick={() => setSelectedRole("exporter")}
            data-testid="card-role-exporter"
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto p-4 bg-green-500/10 rounded-full w-fit mb-2">
                <Package className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle>U.S. Exporter</CardTitle>
              <CardDescription>Seller of agricultural goods</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Create and manage export transactions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Upload shipping documents</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Track GSM-102 guarantee status</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Access exporter compliance checklists</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover-elevate ${
              selectedRole === "importer"
                ? "border-primary bg-primary/5 ring-2 ring-primary"
                : ""
            }`}
            onClick={() => setSelectedRole("importer")}
            data-testid="card-role-importer"
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto p-4 bg-blue-500/10 rounded-full w-fit mb-2">
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
              <CardTitle>Importer</CardTitle>
              <CardDescription>Buyer / Distributor overseas</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                  <span>View incoming shipment details</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Manage LC and payment documents</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Track customs and clearance status</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Access importer compliance checklists</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedRole || selectRoleMutation.isPending}
            className="gap-2"
            data-testid="button-confirm-role"
          >
            {selectRoleMutation.isPending ? "Setting up..." : "Continue"}
            <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="text-xs text-muted-foreground">
            Need admin access? Contact your Global Trade Facilitators representative.
          </p>
        </div>
      </div>
    </div>
  );
}
