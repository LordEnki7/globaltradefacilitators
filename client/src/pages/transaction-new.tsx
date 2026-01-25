import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Package, FileText, Sparkles, CheckCircle, ChevronRight, Globe, Building2, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { insertTransactionSchema, USDA_APPROVED_COUNTRIES, TRANSACTION_TEMPLATES } from "@shared/schema";
import type { InsertTransaction, TransactionTemplate } from "@shared/schema";
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
  const [selectedTemplate, setSelectedTemplate] = useState<TransactionTemplate | null>(null);
  const [creationMode, setCreationMode] = useState<"template" | "manual">("template");

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
      const transaction = await apiRequest("POST", "/api/transactions", data);
      const txData = await transaction.json();
      if (selectedTemplate) {
        await apiRequest("POST", "/api/workflows", {
          transactionId: txData.id,
          templateId: selectedTemplate.id,
          autoAdvanceEnabled: true
        });
      }
      return txData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Transaction Created",
        description: selectedTemplate 
          ? `Your ${selectedTemplate.name} transaction has been created with the 90-day workflow.`
          : "Your GSM-102 transaction has been created successfully.",
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

  const applyTemplate = (template: TransactionTemplate) => {
    setSelectedTemplate(template);
    const dealYear = new Date().getFullYear();
    const dealNum = String(Math.floor(Math.random() * 900) + 100);
    
    form.setValue("dealId", `ZAPP-${dealYear}-${dealNum}`);
    form.setValue("product", template.product);
    form.setValue("quantity", template.suggestedQuantity);
    form.setValue("valueUsd", template.suggestedValueUsd);
    form.setValue("destinationCountry", template.country);
    form.setValue("importerBank", template.approvedBanks[0] || "");
    form.setValue("lcTenor", template.lcTenor);
    form.setValue("incoterms", template.incoterms);
    form.setValue("notes", `LC Special Conditions: ${template.lcSpecialConditions}`);
  };

  const onSubmit = (data: InsertTransaction) => {
    createMutation.mutate(data);
  };

  const selectedCountry = USDA_APPROVED_COUNTRIES.find(
    c => c.name === form.watch("destinationCountry")
  );

  const templatesByCountry = TRANSACTION_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.country]) {
      acc[template.country] = [];
    }
    acc[template.country].push(template);
    return acc;
  }, {} as Record<string, TransactionTemplate[]>);

  const getProductTypeColor = (type: string) => {
    switch (type) {
      case "dry_goods": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "frozen_meats": return "bg-sky-500/20 text-sky-400 border-sky-500/30";
      case "edible_oils": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "packaged_foods": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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

      <Tabs value={creationMode} onValueChange={(v) => setCreationMode(v as "template" | "manual")} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="template" className="gap-2" data-testid="tab-template">
            <FileText className="h-4 w-4" />
            Quick Start Templates
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-2" data-testid="tab-manual">
            <Package className="h-4 w-4" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="template" className="mt-6 space-y-6">
          {selectedTemplate ? (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedTemplate.name}</CardTitle>
                      <CardDescription>{selectedTemplate.description}</CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedTemplate(null)}
                    data-testid="button-change-template"
                  >
                    Change Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Product</span>
                    <span className="font-medium">{selectedTemplate.product}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Value</span>
                    <span className="font-medium">${selectedTemplate.suggestedValueUsd.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">LC Tenor</span>
                    <span className="font-medium">{selectedTemplate.lcTenor}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Incoterms</span>
                    <span className="font-medium">{selectedTemplate.incoterms}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary" />
                    90-Day Workflow Enabled
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["Foundation", "Compliance", "Financing", "Execution", "Shipping", "Scale"].map((phase, i) => (
                      <Badge key={phase} variant="outline" className="text-xs">
                        {i + 1}. {phase}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <h4 className="text-sm font-medium mb-2">Country-Specific Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedTemplate.countrySpecificRequirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-primary" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Select a template to auto-fill deal details and enable the 90-day workflow</span>
              </div>

              {Object.entries(templatesByCountry).map(([country, templates]) => (
                <div key={country} className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {country}
                    {country === "Ghana" && (
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
                        Recommended for First Deals
                      </Badge>
                    )}
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {templates.map((template) => (
                      <Card 
                        key={template.id} 
                        className="cursor-pointer hover-elevate transition-all"
                        onClick={() => applyTemplate(template)}
                        data-testid={`template-${template.id}`}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{template.product}</CardTitle>
                            <Badge className={getProductTypeColor(template.productType)}>
                              {template.productType.replace("_", " ")}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              ${template.suggestedValueUsd.toLocaleString()} | {template.suggestedQuantity}
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTemplate && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Confirm Deal Details
                    </CardTitle>
                    <CardDescription>
                      Review and adjust the pre-filled values as needed
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
                              <Input {...field} data-testid="input-deal-id" />
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
                              <Input {...field} data-testid="input-product" />
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
                              <Input {...field} data-testid="input-quantity" />
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
                              <Input type="number" {...field} data-testid="input-value" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="exporterBank"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>U.S. Exporter Bank</FormLabel>
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
                            <FormLabel>Importer Bank ({selectedTemplate.country})</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-importer-bank">
                                  <SelectValue placeholder="Select approved bank" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedTemplate.approvedBanks.map((bank) => (
                                  <SelectItem key={bank} value={bank}>
                                    {bank}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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
                    {createMutation.isPending ? "Creating..." : "Create with 90-Day Workflow"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </TabsContent>

        <TabsContent value="manual" className="mt-6">
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
                            <Input placeholder="e.g., ZAPP-2025-001" {...field} data-testid="input-deal-id-manual" />
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
                            <Input placeholder="e.g., Rice, Frozen Chicken" {...field} data-testid="input-product-manual" />
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
                            <Input placeholder="e.g., 500 MT" {...field} data-testid="input-quantity-manual" />
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
                            <Input type="number" placeholder="0" {...field} data-testid="input-value-manual" />
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
                            <SelectTrigger data-testid="select-country-manual">
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
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Banking & LC Details
                  </CardTitle>
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
                            <Input placeholder="e.g., Bank of America" {...field} data-testid="input-exporter-bank-manual" />
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
                                <SelectTrigger data-testid="select-importer-bank-manual">
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
                              <Input placeholder="Select country first" {...field} disabled data-testid="input-importer-bank-manual" />
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
                            <Input placeholder="LC number if issued" {...field} data-testid="input-lc-number-manual" />
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
                              <SelectTrigger data-testid="select-lc-tenor-manual">
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
                              <SelectTrigger data-testid="select-incoterms-manual">
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
                              data-testid="input-etd-manual" 
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
                              data-testid="input-eta-manual" 
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
                            data-testid="input-notes-manual"
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
                  data-testid="button-cancel-manual"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-manual">
                  {createMutation.isPending ? "Creating..." : "Create Transaction"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
