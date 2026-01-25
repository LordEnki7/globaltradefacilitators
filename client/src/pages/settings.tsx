import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Building2,
  Globe,
  Moon,
  Sun,
  UserCog
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { useUser } from "@/lib/user-context";
import type { UserRole } from "@shared/schema";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, setRole } = useUser();

  const roles: { value: UserRole; label: string; description: string }[] = [
    { value: "exporter", label: "Exporter", description: "U.S. agricultural exporter" },
    { value: "importer", label: "Importer", description: "Foreign importer" },
    { value: "admin", label: "Administrator", description: "Full system access" }
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Company Profile
          </CardTitle>
          <CardDescription>
            Your organization information for GSM-102 transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-muted-foreground">Company Name</Label>
              <p className="font-medium">{user.company}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Current Role</Label>
              <div className="flex items-center gap-2">
                <p className="font-medium capitalize">{user.role}</p>
                <Badge variant="secondary" className="text-xs">{user.role === "admin" ? "Full Access" : "Limited"}</Badge>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Country</Label>
              <p className="font-medium">{user.country}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">USDA Registration</Label>
              <p className="font-medium text-emerald-600 dark:text-emerald-400">Verified</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            User Role
          </CardTitle>
          <CardDescription>
            Switch between user roles to view role-specific features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {roles.map((role) => (
              <Button
                key={role.value}
                variant={user.role === role.value ? "default" : "outline"}
                className="h-auto flex-col items-start p-4 text-left"
                onClick={() => setRole(role.value)}
                data-testid={`button-role-${role.value}`}
              >
                <span className="font-medium">{role.label}</span>
                <span className="text-xs opacity-70 font-normal">{role.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you receive alerts and updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-xs text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch id="email-notifications" defaultChecked data-testid="switch-email-notifications" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="document-alerts">Document Alerts</Label>
              <p className="text-xs text-muted-foreground">Get notified when documents need attention</p>
            </div>
            <Switch id="document-alerts" defaultChecked data-testid="switch-document-alerts" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="deadline-reminders">Deadline Reminders</Label>
              <p className="text-xs text-muted-foreground">Receive reminders for upcoming deadlines</p>
            </div>
            <Switch id="deadline-reminders" defaultChecked data-testid="switch-deadline-reminders" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="stage-updates">Stage Updates</Label>
              <p className="text-xs text-muted-foreground">Get notified when transaction stages change</p>
            </div>
            <Switch id="stage-updates" defaultChecked data-testid="switch-stage-updates" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {theme === "dark" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how the application looks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                data-testid="button-theme-light"
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                data-testid="button-theme-dark"
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security
          </CardTitle>
          <CardDescription>
            Document encryption and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-emerald-500" />
              <span className="font-medium text-emerald-600 dark:text-emerald-400">AES-256 Encryption Active</span>
            </div>
            <p className="text-sm text-muted-foreground">
              All trade documents are encrypted at rest using AES-256 encryption. 
              Documents are also encrypted in transit using TLS 1.3.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs text-muted-foreground">Session Security</Label>
              <p className="font-medium">Enabled</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Two-Factor Authentication</Label>
              <p className="font-medium">Available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
