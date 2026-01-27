import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileCheck, Globe, ArrowRight, CheckCircle, Anchor, Building2, Package, MapPin, Activity } from "lucide-react";
import heroImage from "@assets/global_trade_containers_cover_1769476614264.jpg";
import processFlowImage from "@assets/blg_inline_how_does_trade_finance_work_02_1769476764172.png";
import complianceImage from "@assets/foreign-trade-legal-advice_1769476846132.webp";
import bankingImage from "@assets/alumni-interview-trade-finance-1024x683_1769476904823.jpg";
import riceWarehouseImage from "@assets/White-Rice-Packing_1769477014542.png";
import controlRoomImage from "@assets/jst-leitstand-fuer-logistik-hero-mobil_1769477147339.webp";
import geographicMapImage from "@assets/geographical_map_1769477917369.png";
import complianceDocsImage from "@assets/second_geographical_image_2_1769477917367.png";
import logoImage from "@assets/logos_for_this_app_1769477935936.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="h-14 w-14 overflow-hidden rounded-lg bg-white flex items-center justify-center"
              data-testid="img-header-logo"
            >
              <div 
                className="w-full h-[400%] bg-contain bg-no-repeat bg-top"
                style={{ 
                  backgroundImage: `url(${logoImage})`,
                  transform: 'translateY(37.5%)'
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight">Global Trade Facilitators</span>
              <span className="text-xs text-muted-foreground">GSM-102 Export Credit</span>
            </div>
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
                  <a href="#how-it-works">How It Works</a>
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

        <section id="how-it-works" className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Trade Finance Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                GSM-102 transactions follow a proven flow connecting exporters, banks, 
                and importers with government-backed credit guarantees.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm">
              <img 
                src={processFlowImage} 
                alt="Trade Finance Flow: Exporter to Bank to Shipment to Importer to Repayment"
                className="w-full max-w-3xl mx-auto"
                data-testid="img-process-flow"
              />
            </div>
            
            <div className="grid md:grid-cols-5 gap-4 mt-10">
              {[
                { step: "1", title: "Contract", desc: "Exporter & Importer sign sales agreement" },
                { step: "2", title: "LC Issued", desc: "Importer's bank issues Letter of Credit" },
                { step: "3", title: "Shipping", desc: "Goods shipped via carrier with B/L" },
                { step: "4", title: "Documents", desc: "Banks exchange docs & verify compliance" },
                { step: "5", title: "Payment", desc: "Exporter paid, importer receives goods" },
              ].map((item) => (
                <div key={item.step} className="text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mx-auto">
                    {item.step}
                  </div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
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

        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={complianceImage} 
                  alt="Trade compliance documentation and legal review"
                  className="w-full h-auto object-cover"
                  data-testid="img-compliance"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Documentation-Driven Compliance</h2>
                <p className="text-muted-foreground leading-relaxed">
                  GSM-102 success depends on rigorous documentation. Every transaction 
                  follows established procedures with verified paperwork at each stage.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Master Compliance Checklists</p>
                      <p className="text-sm text-muted-foreground">
                        8-phase exporter checklist and 6-phase importer checklist with stop gates
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Document Verification</p>
                      <p className="text-sm text-muted-foreground">
                        Track LC, Bill of Lading, Certificate of Origin, and all required forms
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Organized Deal Room</p>
                      <p className="text-sm text-muted-foreground">
                        7-folder structure matching industry standards for bank presentations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Export Package Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        Download or email complete document packages to officials
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 order-2 md:order-1">
                <div className="flex items-center gap-2 text-primary">
                  <Building2 className="h-5 w-5" />
                  <span className="text-sm font-medium tracking-wide uppercase">Banking & Finance</span>
                </div>
                <h2 className="text-3xl font-bold">Government-Backed Credit Structure</h2>
                <p className="text-muted-foreground leading-relaxed">
                  GSM-102 provides a USDA guarantee that covers up to 98% of principal and interest, 
                  giving banks confidence to issue Letters of Credit for agricultural exports.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                      LC
                    </div>
                    <div>
                      <p className="font-medium">Letter of Credit Financing</p>
                      <p className="text-sm text-muted-foreground">
                        Bank-issued LCs with GSM-102 guarantee clauses for payment assurance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                      CCC
                    </div>
                    <div>
                      <p className="font-medium">USDA CCC Guarantee</p>
                      <p className="text-sm text-muted-foreground">
                        Commodity Credit Corporation backing reduces bank risk exposure
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                      90d
                    </div>
                    <div>
                      <p className="font-medium">Extended Payment Terms</p>
                      <p className="text-sm text-muted-foreground">
                        Up to 18 months financing for qualified importers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg order-1 md:order-2">
                <img 
                  src={bankingImage} 
                  alt="Professional banking partnership meeting"
                  className="w-full h-auto object-cover"
                  data-testid="img-banking"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={riceWarehouseImage} 
                  alt="Industrial scale rice warehouse with bulk quantities"
                  className="w-full h-auto object-cover"
                  data-testid="img-product-rice"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary">
                  <Package className="h-5 w-5" />
                  <span className="text-sm font-medium tracking-wide uppercase">Product Categories</span>
                </div>
                <h2 className="text-3xl font-bold">Agricultural Commodities at Scale</h2>
                <p className="text-muted-foreground leading-relaxed">
                  GSM-102 supports a wide range of U.S. agricultural products for export. 
                  Our templates are optimized for high-demand commodities in West African 
                  and Caribbean markets.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-card border rounded-lg">
                    <p className="font-semibold">Rice</p>
                    <p className="text-sm text-muted-foreground">Long grain, parboiled, basmati</p>
                  </div>
                  <div className="p-4 bg-card border rounded-lg">
                    <p className="font-semibold">Frozen Poultry</p>
                    <p className="text-sm text-muted-foreground">Chicken leg quarters, wings</p>
                  </div>
                  <div className="p-4 bg-card border rounded-lg">
                    <p className="font-semibold">Edible Oils</p>
                    <p className="text-sm text-muted-foreground">Soybean, vegetable, palm</p>
                  </div>
                  <div className="p-4 bg-card border rounded-lg">
                    <p className="font-semibold">Tomato Paste</p>
                    <p className="text-sm text-muted-foreground">Canned, drums, bulk</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  Country-specific templates include pre-configured product requirements, 
                  health certificates, and customs documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="markets" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 text-primary mb-4">
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-medium tracking-wide uppercase">Markets We Serve</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Strategic Regional Focus</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We prioritize markets with established banking relationships, clear regulatory 
                frameworks, and strong demand for U.S. agricultural products.
              </p>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-lg mb-12">
              <img 
                src={geographicMapImage} 
                alt="Global trade routes connecting Dominican Republic, Caribbean, and West Africa"
                className="w-full h-auto object-cover"
                data-testid="img-geographic-map"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-emerald-500 to-emerald-600" />
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                      <Globe className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">West Africa</h3>
                      <p className="text-sm text-muted-foreground">Primary Focus Region</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Strong demand for rice, frozen poultry, and edible oils. 
                    Established banking channels and clear import procedures.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium">Ghana</span>
                      <span className="text-xs text-muted-foreground">- Fastest, cleanest market</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium">Nigeria</span>
                      <span className="text-xs text-muted-foreground">- Largest volume potential</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium">Senegal</span>
                      <span className="text-xs text-muted-foreground">- Growing import demand</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-cyan-500 to-cyan-600" />
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-cyan-500/10 rounded-lg">
                      <Globe className="h-6 w-6 text-cyan-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Caribbean</h3>
                      <p className="text-sm text-muted-foreground">Established Trade Corridor</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Consistent demand for U.S. agricultural products with 
                    reliable banking infrastructure and proximity advantages.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-500" />
                      <span className="font-medium">Dominican Republic</span>
                      <span className="text-xs text-muted-foreground">- Key trading partner</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Jamaica</span>
                      <span className="text-xs text-muted-foreground">- Coming soon</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground italic">
                      Future expansion: Europe, Asia, additional Africa markets
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={complianceDocsImage} 
                alt="Trade compliance documents including Certificate of Origin, Bill of Lading, and Health Certificate with approval stamps"
                className="w-full h-auto object-cover"
                data-testid="img-compliance-docs"
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 order-2 md:order-1">
                <div className="flex items-center gap-2 text-primary">
                  <Activity className="h-5 w-5" />
                  <span className="text-sm font-medium tracking-wide uppercase">Deal Operations</span>
                </div>
                <h2 className="text-3xl font-bold">Active Transaction Monitoring</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Every GSM-102 transaction is tracked through our centralized dashboard. 
                  Real-time visibility into document status, compliance checkpoints, 
                  and payment milestones.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Stage-by-Stage Tracking</p>
                      <p className="text-sm text-muted-foreground">
                        Monitor progress from Application through Completion
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Automated Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Alerts for missing documents and approaching deadlines
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">90-Day Workflow Dashboard</p>
                      <p className="text-sm text-muted-foreground">
                        6-phase guided execution from foundation to scale
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg order-1 md:order-2">
                <img 
                  src={controlRoomImage} 
                  alt="Operations control room with transaction monitoring dashboards"
                  className="w-full h-auto object-cover"
                  data-testid="img-control-room"
                />
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
            <div className="flex items-center gap-3">
              <div 
                className="h-12 w-12 overflow-hidden rounded-lg bg-white flex items-center justify-center"
                data-testid="img-footer-logo"
              >
                <div 
                  className="w-full h-[400%] bg-contain bg-no-repeat bg-top"
                  style={{ 
                    backgroundImage: `url(${logoImage})`,
                    transform: 'translateY(12.5%)'
                  }}
                />
              </div>
              <span className="font-medium">Global Trade Facilitators</span>
            </div>
            <p>&copy; {new Date().getFullYear()} GSM-102 Export Credit Guarantee Tracker</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
