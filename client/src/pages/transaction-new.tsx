import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertTransactionSchema, USDA_APPROVED_COUNTRIES } from "@shared/schema";
import type { InsertTransaction } from "@shared/schema";
import { z } from "zod";

const formSchema = insertTransactionSchema.extend({
  dealId: z.string().min(3, "Deal ID must be at least 3 characters"),
  product: z.string().min(2, "Product description required"),
  quantity: z.string().min(1, "Quantity required"),
  valueUsd: z.coerce.number().positive("Value must be positive"),
  destinationCountry: z.string().min(2, "Select a destination country"),
  exporterBank: z.string().min(2, "Exporter bank required"),
  importerBank: z.string().min(2, "Importer bank required"),
});

export default function TransactionNewPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertTransaction>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dealId: "",
      exporterId: "exporter-1",
      importerId: "importer-1",
      product: "",
      quantity: "",
      valueUsd: 0,
      destinationCountry: "",
      exporterBank: "",
      importerBank: "",
      lcNumber: "",
      lcTenor: "180 days",
      incoterms: "FOB",
      etd: null,
      eta: null,
      notes: ""
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTransaction) => {
      return apiRequest("POST", "/api/transactions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Transaction Created",
        description: "Your GSM-102 transaction has been created successfully.",
      });
      navigate("/transactions");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create transaction.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: InsertTransaction) => {
    createMutation.mutate(data);
  };

  const selectedCountry = USDA_APPROVED_COUNTRIES.find(
    c => c.name === form.watch("destinationCountry")
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/transactions")} data-testid="button-back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">New Transaction</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create a new GSM-102 Export Credit Guarantee transaction
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Deal Information
              </CardTitle>
              <CardDescription>
                Basic details about this export transaction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dealId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deal ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., ZAPP-2025-001" {...field} data-testid="input-deal-id" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Rice, Frozen Chicken" {...field} data-testid="input-product" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 500 MT" {...field} data-testid="input-quantity" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valueUsd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} data-testid="input-value" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="destinationCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Country</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-country">
                          <SelectValue placeholder="Select USDA-approved country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {USDA_APPROVED_COUNTRIES.filter(c => c.isActive).map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name} ({country.region})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Only USDA GSM-102 approved countries are listed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Banking & LC Details</CardTitle>
              <CardDescription>
                Letter of Credit and banking information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="exporterBank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exporter Bank (US)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bank of America" {...field} data-testid="input-exporter-bank" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="importerBank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Importer Bank</FormLabel>
                      {selectedCountry ? (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-importer-bank">
                              <SelectValue placeholder="Select approved bank" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedCountry.approvedBanks.map((bank) => (
                              <SelectItem key={bank} value={bank}>
                                {bank}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <FormControl>
                          <Input placeholder="Select country first" {...field} disabled data-testid="input-importer-bank" />
                        </FormControl>
                      )}
                      <FormDescription>
                        USDA-approved banks for the selected country
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="lcNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LC Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="LC number if issued" {...field} data-testid="input-lc-number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lcTenor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LC Tenor</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-lc-tenor">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="90 days">90 days</SelectItem>
                          <SelectItem value="180 days">180 days</SelectItem>
                          <SelectItem value="360 days">360 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="incoterms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incoterms</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-incoterms">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FOB">FOB (Free on Board)</SelectItem>
                          <SelectItem value="CIF">CIF (Cost, Insurance, Freight)</SelectItem>
                          <SelectItem value="CFR">CFR (Cost and Freight)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="etd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ETD (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          value={field.value || ""} 
                          onChange={(e) => field.onChange(e.target.value || null)}
                          data-testid="input-etd" 
                        />
                      </FormControl>
                      <FormDescription>Estimated Time of Departure</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ETA (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          value={field.value || ""} 
                          onChange={(e) => field.onChange(e.target.value || null)}
                          data-testid="input-eta" 
                        />
                      </FormControl>
                      <FormDescription>Estimated Time of Arrival</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional notes about this transaction..."
                        className="resize-none"
                        rows={3}
                        {...field}
                        data-testid="input-notes"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/transactions")}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit">
              {createMutation.isPending ? "Creating..." : "Create Transaction"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
