import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileCheck, Globe, ArrowRight, CheckCircle, Anchor, Building2 } from "lucide-react";
import heroImage from "@assets/global_trade_containers_cover_1769476614264.jpg";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Zapp GSM-102</span>
          </div>
          <Button asChild data-testid="button-login-nav">
            <a href="/api/login">Sign In</a>
          </Button>
        </div>
      </nav>

      <main className="pt-16">
        <section className="relative min-h-[600px] flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Anchor className="h-5 w-5" />
                <span className="text-sm font-medium tracking-wide uppercase">USDA Export Credit Guarantee Program</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight" data-testid="heading-hero">
                Global Trade.
                <span className="block text-primary">Institutional Precision.</span>
              </h1>
              
              <p className="text-lg text-gray-200 leading-relaxed max-w-xl">
                Zapp Marketing & Manufacturing delivers structured GSM-102 transactions 
                with bank-ready documentation, regulatory compliance, and end-to-end 
                deal management for agricultural exports.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild data-testid="button-get-started">
                  <a href="/api/login" className="gap-2">
                    Access Deal Portal <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white backdrop-blur-sm" asChild>
                  <a href="#features">View Capabilities</a>
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 pt-6 text-sm text-gray-300">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  USDA Approved Markets
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  LC Documentation Ready
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Bank Compliant
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-6 border-b bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">15+</p>
                <p className="text-sm text-muted-foreground">Approved Countries</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">13</p>
                <p className="text-sm text-muted-foreground">Deal Templates</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">90</p>
                <p className="text-sm text-muted-foreground">Day Workflow</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">5</p>
                <p className="text-sm text-muted-foreground">Stage Pipeline</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4" data-testid="heading-features">
                Enterprise-Grade Trade Management
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Purpose-built for agricultural exporters navigating USDA GSM-102 transactions 
                across West Africa, the Caribbean, and emerging markets.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover-elevate">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Document Control</h3>
                  <p className="text-muted-foreground">
                    Centralized document management with verification tracking, 
                    mobile scanning, and organized deal room structure for bank presentations.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Compliance Checklists</h3>
                  <p className="text-muted-foreground">
                    Comprehensive phase-based checklists for exporters (8 phases) 
                    and importers (6 phases) with stop gates and blocking item alerts.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Market Templates</h3>
                  <p className="text-muted-foreground">
                    Country-specific templates for Ghana, Nigeria, Senegal, 
                    and Dominican Republic with pre-approved banks and LC language.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Built for Institutional Partners</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you're a U.S. exporter, foreign importer, or banking institution, 
                  our platform provides the documentation standards and workflow transparency 
                  required for GSM-102 guaranteed transactions.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg mt-1">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Bank-Ready Documentation</p>
                      <p className="text-sm text-muted-foreground">
                        Export packages formatted for LC presentations and regulatory review
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg mt-1">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Role-Based Access</p>
                      <p className="text-sm text-muted-foreground">
                        Separate portals for exporters, importers, and administrators
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg mt-1">
                      <Anchor className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">90-Day Guided Workflow</p>
                      <p className="text-sm text-muted-foreground">
                        Structured 6-phase process from deal foundation to scaling
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card border rounded-lg p-8 space-y-6">
                <h3 className="text-xl font-semibold">Transaction Pipeline</h3>
                <div className="space-y-4">
                  {[
                    { stage: "Application", desc: "LC issuance & deal setup" },
                    { stage: "Approval", desc: "GSM-102 guarantee & documentation" },
                    { stage: "Shipment", desc: "Goods shipped & shipping docs" },
                    { stage: "Payment", desc: "Processing & USDA form submission" },
                    { stage: "Completed", desc: "Transaction successfully closed" },
                  ].map((item, i) => (
                    <div key={item.stage} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.stage}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold">Ready to Execute Your Next Deal?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access the Zapp GSM-102 portal to manage your agricultural export transactions 
              with the documentation standards banks and regulators expect.
            </p>
            <Button size="lg" asChild data-testid="button-cta-bottom">
              <a href="/api/login" className="gap-2">
                Sign In to Deal Portal <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>

        <footer className="border-t py-8 px-6 bg-muted/20">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium">Zapp Marketing & Manufacturing</span>
            </div>
            <p>&copy; {new Date().getFullYear()} GSM-102 Export Credit Guarantee Tracker</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
