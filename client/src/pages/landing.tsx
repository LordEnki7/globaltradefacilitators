import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileCheck, Globe, ArrowRight, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">GSM-102 Tracker</span>
          </div>
          <Button asChild data-testid="button-login-nav">
            <a href="/api/login">Sign In</a>
          </Button>
        </div>
      </nav>

      <main className="pt-20">
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight" data-testid="heading-hero">
              USDA Export Credit Guarantee
              <span className="block text-primary">Made Simple</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Streamline your GSM-102 transactions from application to payment. 
              Track documents, manage compliance, and close deals faster with 
              Zapp Marketing & Manufacturing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild data-testid="button-get-started">
                <a href="/api/login" className="gap-2">
                  Get Started <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Free to use
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Secure & encrypted
              </span>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" data-testid="heading-features">
              Everything You Need for GSM-102 Success
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover-elevate">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Document Management</h3>
                  <p className="text-muted-foreground">
                    Upload, verify, and track all required documents. 
                    Mobile scanning support and AES-256 encryption.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Compliance Tracking</h3>
                  <p className="text-muted-foreground">
                    Master checklists for exporters and importers. 
                    Phase-based workflows with stop gates.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Country Templates</h3>
                  <p className="text-muted-foreground">
                    Pre-built templates for Ghana, Nigeria, Senegal, 
                    and Dominican Republic with approved banks.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-2xl font-bold">Ready to Streamline Your Exports?</h2>
            <p className="text-muted-foreground">
              Join Zapp Marketing & Manufacturing and start managing your 
              GSM-102 transactions with confidence.
            </p>
            <Button size="lg" asChild data-testid="button-cta-bottom">
              <a href="/api/login" className="gap-2">
                Sign In to Get Started <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>

        <footer className="border-t py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Zapp Marketing & Manufacturing</span>
            </div>
            <p>&copy; {new Date().getFullYear()} GSM-102 Export Credit Guarantee Tracker</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
