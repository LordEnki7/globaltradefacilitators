import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, FileCheck, Globe, ArrowRight, CheckCircle, Building2, Package, MapPin, DollarSign, Users, Landmark, Calculator, Wheat, Drumstick, Droplets, CircleDot } from "lucide-react";
import heroImage from "@assets/global_trade_containers_cover_1769476614264.jpg";
import newFlowChartImage from "@assets/New_Flow_Chart_1769862149111.png";
import bankingImage from "@assets/alumni-interview-trade-finance-1024x683_1769476904823.jpg";
import riceWarehouseImage from "@assets/White-Rice-Packing_1769477014542.png";
import geographicMapImage from "@assets/geographical_map_1769477917369.png";
import logoShipMain from "../assets/logo-ship-main.png";

export default function LandingPage() {
  const [dealAmount, setDealAmount] = useState(500000);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const calculations = {
    exporterLow: dealAmount * 0.08,
    exporterHigh: dealAmount * 0.15,
    importerLow: dealAmount * 0.12,
    importerHigh: dealAmount * 0.25,
    facilitatorLow: dealAmount * 0.015,
    facilitatorHigh: dealAmount * 0.03,
    usBankLow: dealAmount * 0.0075,
    usBankHigh: dealAmount * 0.015,
    foreignBankLow: dealAmount * 0.01,
    foreignBankHigh: dealAmount * 0.03,
    logisticsLow: dealAmount * 0.04,
    logisticsHigh: dealAmount * 0.08,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={logoShipMain} 
              alt="Global Trade Facilitators" 
              className="h-14 w-auto"
              data-testid="img-header-logo"
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold leading-tight text-slate-800 dark:text-slate-100">Global Trade Facilitators</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">GSM-102 Export Credit</span>
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
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-800/70 to-slate-700/50" />
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center gap-2 text-teal-400">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium tracking-wide uppercase">USDA Export Credit Guarantee Program</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight" data-testid="heading-hero">
                Agricultural Exports
                <span className="block text-teal-400">from the U.S. on Credit</span>
              </h1>
              
              <p className="text-lg text-slate-200 leading-relaxed max-w-xl">
                We facilitate U.S. agricultural exports using the USDA GSM-102 Export Credit Guarantee Program, 
                allowing qualified international buyers to purchase American-origin products on deferred payment 
                terms while U.S. sellers are paid immediately.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild className="bg-teal-600 hover:bg-teal-700" data-testid="button-get-started">
                  <a href="/api/login" className="gap-2">
                    Access Deal Portal <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white backdrop-blur-sm" asChild>
                  <a href="#how-it-works">How It Works</a>
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 pt-6 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-400" />
                  Non-Funded Letters of Credit
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-400" />
                  Government-Backed Guarantees
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-400" />
                  U.S. Confirming Banks
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-6 border-b bg-white dark:bg-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl font-semibold text-teal-600 dark:text-teal-400">15+</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Approved Countries</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-teal-600 dark:text-teal-400">98%</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Principal Guaranteed</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-teal-600 dark:text-teal-400">90</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Day Workflow</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-teal-600 dark:text-teal-400">5</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Stage Pipeline</p>
              </div>
            </div>
          </div>
        </section>

        <section id="what-is-gsm102" className="py-20 px-6 bg-slate-100 dark:bg-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4 text-slate-800 dark:text-slate-100" data-testid="heading-gsm-explanation">
                What is GSM-102?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                GSM-102 is the USDA's export credit guarantee program that supports U.S. agricultural 
                exports through LC-based financing.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-navy-100 dark:bg-navy-900/30 rounded-lg" style={{ backgroundColor: 'rgba(30, 58, 95, 0.1)' }}>
                      <Shield className="h-6 w-6" style={{ color: '#1e3a5f' }} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">The Name Explained</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-semibold text-teal-600 dark:text-teal-400 min-w-[60px]">GSM</span>
                      <span className="text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-800 dark:text-slate-200">General Sales Manager</span> — the legacy internal name 
                        USDA Commodity Credit Corporation used decades ago for export credit programs
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-semibold text-teal-600 dark:text-teal-400 min-w-[60px]">102</span>
                      <span className="text-slate-600 dark:text-slate-400">
                        Identifies the <span className="font-medium text-slate-800 dark:text-slate-200">short-to-medium term</span> credit 
                        guarantee program (GSM-103 was long-term but is no longer active)
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-500 italic">
                      The term "GSM" is outdated language, but the program is very much alive. USDA never rebranded it, 
                      so everyone still uses GSM-102.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(196, 164, 100, 0.15)' }}>
                      <Building2 className="h-6 w-6" style={{ color: '#c4a464' }} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">What It Actually Does</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    A U.S. government-backed guarantee that helps foreign buyers purchase U.S. agricultural 
                    products using Letters of Credit, while protecting U.S. exporters and banks from non-payment.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Guarantees up to 98% of principal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Covers approved foreign banks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Supports USD Letters of Credit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Importers buy now, pay later</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-6 md:p-8">
              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    In Plain English
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    The USDA guarantees that if a foreign bank defaults on an agricultural import payment, 
                    the U.S. government will cover the loss. This means:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300"><span className="font-medium">Exporters get paid immediately</span> — no waiting on foreign payments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300"><span className="font-medium">Importers get extended terms</span> — buy now and pay later with LC financing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300"><span className="font-medium">Banks are protected</span> — U.S. government backs up to 98% of principal</span>
                    </li>
                  </ul>
                </div>
                <div className="hidden md:flex items-center justify-center">
                  <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="text-4xl font-semibold text-teal-600 dark:text-teal-400">98%</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Principal Guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="deal-economics" className="py-20 px-6 bg-white dark:bg-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold mb-4 text-slate-800 dark:text-slate-100" data-testid="heading-deal-economics">
                Deal Value Calculator
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Enter your deal amount to see how value flows through a GSM-102 transaction. 
                Everyone gets paid, no one is squeezed, and banks are protected.
              </p>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-6 mb-10 max-w-xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Enter Deal Value</h3>
              </div>
              <div className="space-y-3">
                <Label htmlFor="deal-amount" className="text-sm text-slate-600 dark:text-slate-400">
                  Contract Value (USD)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <Input
                    id="deal-amount"
                    type="number"
                    min={10000}
                    max={10000000}
                    step={10000}
                    value={dealAmount}
                    onChange={(e) => setDealAmount(Math.max(10000, Number(e.target.value)))}
                    className="pl-8 text-xl font-semibold h-14 bg-white dark:bg-slate-800"
                    data-testid="input-deal-amount"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[100000, 250000, 500000, 1000000, 2000000].map((amount) => (
                    <Button 
                      key={amount}
                      variant="outline" 
                      size="sm"
                      onClick={() => setDealAmount(amount)}
                      className={dealAmount === amount ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30" : ""}
                      data-testid={`button-preset-${amount}`}
                    >
                      {formatCurrency(amount)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(30, 58, 95, 0.1)' }}>
                      <Package className="h-5 w-5" style={{ color: '#1e3a5f' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">U.S. Seller</h3>
                      <p className="text-xs text-slate-500">(Exporter)</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Typical Margin</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">8% – 15%</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-slate-600 dark:text-slate-400">Earnings</span>
                      <span className="font-semibold" style={{ color: '#1e3a5f' }} data-testid="calc-exporter">
                        {formatCurrency(calculations.exporterLow)} – {formatCurrency(calculations.exporterHigh)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    Gets paid immediately once documents are clean. Low risk with government-backed payment.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)' }}>
                      <Globe className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">Buyer</h3>
                      <p className="text-xs text-slate-500">(Importer)</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Typical Margin</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">12% – 25%</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-slate-600 dark:text-slate-400">Earnings</span>
                      <span className="font-semibold text-teal-600" data-testid="calc-importer">
                        {formatCurrency(calculations.importerLow)} – {formatCurrency(calculations.importerHigh)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    Carries customs, VAT, FX exposure, and market risk. Higher margins in Africa/Caribbean.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-teal-100 dark:bg-teal-800/50 rounded-lg">
                      <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">You — Facilitator</h3>
                      <p className="text-xs text-slate-500">Structure & Compliance</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Typical Fee</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">1.5% – 3%</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-slate-600 dark:text-slate-400">Earnings</span>
                      <span className="font-semibold text-teal-600 dark:text-teal-400" data-testid="calc-facilitator">
                        {formatCurrency(calculations.facilitatorLow)} – {formatCurrency(calculations.facilitatorHigh)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-teal-200 dark:border-teal-700">
                    No inventory risk. Best structure: upfront fee + embedded in transaction.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(75, 85, 99, 0.1)' }}>
                      <Building2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">U.S. Confirming Bank</h3>
                      <p className="text-xs text-slate-500">Financing</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Annualized Rate</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">0.75% – 1.5%</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-slate-600 dark:text-slate-400">Earnings</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-400" data-testid="calc-usbank">
                        {formatCurrency(calculations.usBankLow)} – {formatCurrency(calculations.usBankHigh)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    Minimal risk with 98% USDA guarantee. Short duration, clean paper.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(75, 85, 99, 0.15)' }}>
                      <Landmark className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">Issuing Bank</h3>
                      <p className="text-xs text-slate-500">(Buyer's Bank)</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Fees + Interest</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">1% – 3%</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-slate-600 dark:text-slate-400">Earnings</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300" data-testid="calc-foreignbank">
                        {formatCurrency(calculations.foreignBankLow)} – {formatCurrency(calculations.foreignBankHigh)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    LC issuance fee, commitment fee, and interest spread. Carries importer credit risk.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(196, 164, 100, 0.15)' }}>
                      <CircleDot className="h-5 w-5" style={{ color: '#c4a464' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">USDA CCC</h3>
                      <p className="text-xs text-slate-500">Guarantee Provider</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Guarantee Fee</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">Varies</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-slate-600 dark:text-slate-400">Coverage</span>
                      <span className="font-semibold" style={{ color: '#c4a464' }}>
                        Up to 98%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    Only pays in event of default. Reduces risk for all parties in the transaction.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-200 dark:border-slate-700">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <DollarSign className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    Your Annual Potential
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Based on {formatCurrency(dealAmount)} deals at 2% average facilitator fee:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Everyone gets paid — no one is squeezed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Banks are protected by 98% USDA guarantee</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">You earn without inventory or FX risk</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Government backs the credit — deals scale cleanly</span>
                    </li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-4 text-center border border-slate-200 dark:border-slate-700">
                    <p className="text-2xl font-semibold text-teal-600 dark:text-teal-400">1 deal/mo</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400" data-testid="calc-annual-1">
                      ~{formatCurrency(dealAmount * 0.02 * 12)}/year
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-4 text-center border border-slate-200 dark:border-slate-700">
                    <p className="text-2xl font-semibold text-teal-600 dark:text-teal-400">2 deals/mo</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400" data-testid="calc-annual-2">
                      ~{formatCurrency(dealAmount * 0.02 * 24)}/year
                    </p>
                  </div>
                  <div className="col-span-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg p-4 text-center border border-teal-200 dark:border-teal-800">
                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">$1M deals = Double everything</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">And you still don't touch product</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-6 bg-slate-100 dark:bg-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold mb-4 text-slate-800 dark:text-slate-100" data-testid="heading-features">
                Enterprise-Grade Trade Management
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Purpose-built for agricultural exporters navigating USDA GSM-102 transactions 
                across West Africa, the Caribbean, and emerging markets.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover-elevate bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg w-fit">
                    <FileCheck className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Document Control</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Centralized document management with verification tracking, 
                    mobile scanning, and organized deal room structure for bank presentations.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-elevate bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg w-fit">
                    <Shield className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Compliance Checklists</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Comprehensive phase-based checklists for exporters (8 phases) 
                    and importers (6 phases) with stop gates and blocking item alerts.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-elevate bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg w-fit">
                    <Globe className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Market Templates</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Country-specific templates for Ghana, Nigeria, Senegal, 
                    and Dominican Republic with pre-approved banks and LC language.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 px-6 bg-white dark:bg-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4 text-slate-800 dark:text-slate-100">How Trade Finance Works</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                We facilitate U.S. agricultural exports using the USDA GSM-102 Export Credit Guarantee Program, 
                allowing qualified international buyers to purchase American-origin agricultural products on 
                deferred payment terms while U.S. sellers are paid immediately.
              </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 md:p-8 border border-slate-200 dark:border-slate-700">
              <img 
                src={newFlowChartImage} 
                alt="GSM-102 Trade Finance Flow: U.S. Seller, Buyer, USDA CCC, Issuing Bank, U.S. Confirming Bank"
                className="w-full max-w-4xl mx-auto"
                data-testid="img-process-flow"
              />
            </div>
            
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">The Process Flow</h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-semibold shrink-0">1</span>
                    <span className="text-slate-700 dark:text-slate-300">U.S. Seller issues a Proforma Invoice / Proforma Contract to the Buyer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-semibold shrink-0">2</span>
                    <span className="text-slate-700 dark:text-slate-300">Buyer signs and accepts the Proforma Contract and returns it to the Seller</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-semibold shrink-0">3</span>
                    <span className="text-slate-700 dark:text-slate-300">Seller submits signed Proforma Contract and GSM-102 application to USDA CCC</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-semibold shrink-0">4</span>
                    <span className="text-slate-700 dark:text-slate-300">CCC issues a GSM-102 Guarantee Letter to the Seller</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-semibold shrink-0">5</span>
                    <span className="text-slate-700 dark:text-slate-300">Seller requests a non-funded, open Letter of Credit from the Buyer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-semibold shrink-0">6</span>
                    <span className="text-slate-700 dark:text-slate-300">Buyer applies for the LC with its Issuing Bank</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-semibold shrink-0">7</span>
                    <span className="text-slate-700 dark:text-slate-300">Issuing Bank issues the LC directly to the Seller</span>
                  </li>
                </ol>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Completion & Payment</h3>
                <ol className="space-y-3 text-sm" start={8}>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-semibold shrink-0">8</span>
                    <span className="text-slate-700 dark:text-slate-300">Seller ships U.S.-origin agricultural products to the Buyer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-semibold shrink-0">9</span>
                    <span className="text-slate-700 dark:text-slate-300">Seller negotiates the LC with a U.S. Confirming Bank</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-semibold shrink-0">10</span>
                    <span className="text-slate-700 dark:text-slate-300">Confirming Bank pays the Seller at sight</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-semibold shrink-0">11</span>
                    <span className="text-slate-700 dark:text-slate-300">Seller reports shipment completion and submits customs-certified proof to CCC</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-semibold shrink-0">12</span>
                    <span className="text-slate-700 dark:text-slate-300">Buyer repays the Issuing Bank under the deferred terms agreed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-semibold shrink-0">13</span>
                    <span className="text-slate-700 dark:text-slate-300">Issuing Bank repays the U.S. Confirming Bank under GSM-102 terms</span>
                  </li>
                </ol>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 italic">
                    Only in the event of default, the CCC pays under the guarantee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-100 dark:bg-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 order-2 md:order-1">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Building2 className="h-5 w-5" />
                  <span className="text-sm font-medium tracking-wide uppercase">Banking & Finance</span>
                </div>
                <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Government-Backed Credit Structure</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Up to 98% of the invoice value, including freight, is guaranteed by the USDA Commodity 
                  Credit Corporation (CCC), significantly reducing payment risk for U.S. exporters and confirming banks.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style={{ backgroundColor: 'rgba(30, 58, 95, 0.15)', color: '#1e3a5f' }}>
                      LC
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-100">Non-Funded Letter of Credit</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Bank-issued LCs with GSM-102 guarantee clauses for payment assurance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style={{ backgroundColor: 'rgba(196, 164, 100, 0.2)', color: '#c4a464' }}>
                      CCC
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-100">USDA CCC Guarantee</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Commodity Credit Corporation backing reduces bank risk exposure
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center text-sm font-semibold shrink-0">
                      18m
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-100">Extended Payment Terms</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
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

        <section className="py-20 px-6 bg-white dark:bg-slate-900">
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
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Package className="h-5 w-5" />
                  <span className="text-sm font-medium tracking-wide uppercase">American Origin Only</span>
                </div>
                <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Eligible U.S. Agricultural Products</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  All products originate exclusively from the United States. GSM-102 supports a wide range 
                  of U.S. agricultural products for export to qualified international buyers.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Wheat className="h-4 w-4 text-amber-600" />
                      <p className="font-semibold text-slate-800 dark:text-slate-100">Grains & Derivatives</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Wheat, Corn, Grain-based derivatives</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Drumstick className="h-4 w-4 text-rose-600" />
                      <p className="font-semibold text-slate-800 dark:text-slate-100">Meat & Poultry</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Beef, Pork, Chicken, Turkey</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <p className="font-semibold text-slate-800 dark:text-slate-100">Dairy Products</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Milk powder, Whey, Butter, Cheese</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-green-600" />
                      <p className="font-semibold text-slate-800 dark:text-slate-100">Oilseeds & General</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Soybeans, Snacks, Beverages</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-500 italic">
                  Country-specific templates include pre-configured product requirements, 
                  health certificates, and customs documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="markets" className="py-20 px-6 bg-slate-100 dark:bg-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400 mb-4">
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-medium tracking-wide uppercase">Markets We Serve</span>
              </div>
              <h2 className="text-3xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Strategic Regional Focus</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                We prioritize markets with established banking relationships, clear regulatory 
                frameworks, and strong demand for U.S. agricultural products.
              </p>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-lg mb-12 border border-slate-200 dark:border-slate-700">
              <img 
                src={geographicMapImage} 
                alt="Global trade routes connecting Dominican Republic, Caribbean, and West Africa"
                className="w-full h-auto object-cover"
                data-testid="img-geographic-map"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="overflow-hidden bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <div className="h-3 bg-gradient-to-r from-teal-500 to-teal-600" />
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                      <Globe className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">West Africa</h3>
                      <p className="text-sm text-slate-500">Primary Focus Region</p>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Strong demand for rice, frozen poultry, and edible oils. 
                    Established banking channels and clear import procedures.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      <span className="font-medium text-slate-800 dark:text-slate-100">Ghana</span>
                      <span className="text-xs text-slate-500">- Fastest, cleanest market</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      <span className="font-medium text-slate-800 dark:text-slate-100">Nigeria</span>
                      <span className="text-xs text-slate-500">- Largest volume potential</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      <span className="font-medium text-slate-800 dark:text-slate-100">Senegal</span>
                      <span className="text-xs text-slate-500">- Growing import demand</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600" />
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Caribbean</h3>
                      <p className="text-sm text-slate-500">Secondary Focus Region</p>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Proximity advantage with established trade routes. 
                    Strong relationships with local banks and importers.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-slate-800 dark:text-slate-100">Dominican Republic</span>
                      <span className="text-xs text-slate-500">- Primary Caribbean partner</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-slate-800 dark:text-slate-100">Jamaica</span>
                      <span className="text-xs text-slate-500">- Expanding coverage</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-800 dark:bg-slate-950">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-semibold text-white">Ready to Facilitate Your First Deal?</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Join Global Trade Facilitators and start managing GSM-102 transactions 
              with professional tools, organized workflows, and comprehensive compliance tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-teal-600 hover:bg-teal-700" data-testid="button-cta-bottom">
                <a href="/api/login" className="gap-2">
                  Access Deal Portal <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-500 text-white hover:bg-slate-700" asChild>
                <a href="#how-it-works">Learn More</a>
              </Button>
            </div>
          </div>
        </section>

        <footer className="py-12 px-6 bg-slate-900 dark:bg-slate-950 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={logoShipMain} 
                    alt="Global Trade Facilitators" 
                    className="h-10 w-auto"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">Global Trade Facilitators</span>
                    <span className="text-xs text-slate-400">A division of Zapp Marketing and Manufacturing</span>
                  </div>
                </div>
                <p className="text-sm text-slate-400">
                  Professional GSM-102 transaction management for U.S. agricultural exports.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#what-is-gsm102" className="hover:text-teal-400 transition-colors">What is GSM-102?</a></li>
                  <li><a href="#how-it-works" className="hover:text-teal-400 transition-colors">How It Works</a></li>
                  <li><a href="#deal-economics" className="hover:text-teal-400 transition-colors">Deal Calculator</a></li>
                  <li><a href="#markets" className="hover:text-teal-400 transition-colors">Markets</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Contact</h4>
                <p className="text-sm text-slate-400">
                  globaltradefacilitators.us.com
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} Global Trade Facilitators. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
