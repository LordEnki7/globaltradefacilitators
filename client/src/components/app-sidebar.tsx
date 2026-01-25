import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  FileText,
  FolderCheck,
  Globe,
  Bell,
  Settings,
  Package,
  Building2,
  User,
  FolderOpen
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/lib/user-context";
import type { Notification } from "@shared/schema";

const mainMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Transactions", url: "/transactions", icon: Package },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Deal Room", url: "/deal-room", icon: FolderOpen },
  { title: "Compliance", url: "/compliance", icon: FolderCheck },
];

const referenceItems = [
  { title: "Approved Countries", url: "/countries", icon: Globe },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useUser();

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const roleLabel = user.role === "admin" ? "Administrator" : 
                    user.role === "exporter" ? "Exporter" : "Importer";

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/">
          <div className="flex items-center gap-3 hover-elevate rounded-md p-1 -m-1 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-lg">
              Z
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground text-sm tracking-tight">Zapp M&M</span>
              <span className="text-xs text-muted-foreground">GSM-102 Tracker</span>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-1">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(" ", "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-1">
            Reference
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {referenceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(" ", "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-1">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location === "/notifications"}
                  data-testid="nav-notifications"
                >
                  <Link href="/notifications">
                    <Bell className="h-4 w-4" />
                    <span className="flex-1">Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="default" className="h-5 min-w-5 px-1.5 text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location === "/settings"}
                  data-testid="nav-settings"
                >
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-sidebar-foreground truncate">
              {user.company}
            </span>
            <span className="text-xs text-muted-foreground">{roleLabel}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
