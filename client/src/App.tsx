import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserProvider } from "@/lib/user-context";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import TransactionsPage from "@/pages/transactions";
import TransactionNewPage from "@/pages/transaction-new";
import TransactionDetailPage from "@/pages/transaction-detail";
import DocumentsPage from "@/pages/documents";
import CompliancePage from "@/pages/compliance";
import CountriesPage from "@/pages/countries";
import NotificationsPage from "@/pages/notifications";
import SettingsPage from "@/pages/settings";
import DealRoomPage from "@/pages/deal-room";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/transactions" component={TransactionsPage} />
      <Route path="/transactions/new" component={TransactionNewPage} />
      <Route path="/transactions/:id" component={TransactionDetailPage} />
      <Route path="/documents" component={DocumentsPage} />
      <Route path="/compliance" component={CompliancePage} />
      <Route path="/deal-room" component={DealRoomPage} />
      <Route path="/countries" component={CountriesPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <TooltipProvider>
            <SidebarProvider style={sidebarStyle as React.CSSProperties}>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <SidebarInset className="flex flex-col flex-1 overflow-hidden">
                  <header className="flex h-14 items-center justify-between gap-4 border-b border-border px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <ThemeToggle />
                  </header>
                  <main className="flex-1 overflow-auto p-6">
                    <Router />
                  </main>
                </SidebarInset>
              </div>
            </SidebarProvider>
            <Toaster />
          </TooltipProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
