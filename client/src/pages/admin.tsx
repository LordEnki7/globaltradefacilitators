import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield, Building2, Mail, Calendar, Loader2, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import type { User } from "@shared/models/auth";

export default function AdminPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [editingCompany, setEditingCompany] = useState<string | null>(null);
  const [companyValue, setCompanyValue] = useState("");

  const { data: userRole, isLoading: isLoadingRole } = useQuery<{ role: string }>({
    queryKey: ["/api/user/role"],
  });

  const isAdmin = userRole?.role === "admin";

  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAdmin,
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      return apiRequest("PATCH", `/api/admin/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Role Updated",
        description: "User role has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async ({ userId, company }: { userId: string; company: string }) => {
      return apiRequest("PATCH", `/api/admin/users/${userId}/company`, { company });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditingCompany(null);
      toast({
        title: "Company Updated",
        description: "User company has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user company.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!isLoadingRole && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [isAdmin, isLoadingRole, setLocation, toast]);

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "exporter":
        return "default";
      case "importer":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleCompanyEdit = (userId: string, currentCompany: string | null) => {
    setEditingCompany(userId);
    setCompanyValue(currentCompany || "");
  };

  const handleCompanySave = (userId: string) => {
    updateCompanyMutation.mutate({ userId, company: companyValue });
  };

  if (isLoadingRole) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loader-admin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium">Admin access required</p>
        <Button onClick={() => setLocation("/")} data-testid="button-go-home">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loader-admin" />
      </div>
    );
  }

  const usersByRole = {
    admin: users.filter(u => u.role === "admin"),
    exporter: users.filter(u => u.role === "exporter"),
    importer: users.filter(u => u.role === "importer"),
    pending: users.filter(u => !u.role || u.role === "pending"),
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold" data-testid="heading-admin">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and assign roles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Shield className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="count-admins">{usersByRole.admin.length}</p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="count-exporters">{usersByRole.exporter.length}</p>
                <p className="text-sm text-muted-foreground">Exporters</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/50 rounded-lg">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="count-importers">{usersByRole.importer.length}</p>
                <p className="text-sm text-muted-foreground">Importers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="count-pending">{usersByRole.pending.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {usersByRole.pending.length > 0 && (
        <Card className="border-orange-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              Pending Users
            </CardTitle>
            <CardDescription>These users need a role assignment before they can access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usersByRole.pending.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onRoleChange={(role) => updateRoleMutation.mutate({ userId: user.id, role })}
                  onCompanyEdit={() => handleCompanyEdit(user.id, user.company)}
                  editingCompany={editingCompany === user.id}
                  companyValue={companyValue}
                  onCompanyValueChange={setCompanyValue}
                  onCompanySave={() => handleCompanySave(user.id)}
                  onCompanyCancel={() => setEditingCompany(null)}
                  isUpdating={updateRoleMutation.isPending || updateCompanyMutation.isPending}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users
          </CardTitle>
          <CardDescription>Manage user roles and company assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.filter(u => u.role && u.role !== "pending").map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onRoleChange={(role) => updateRoleMutation.mutate({ userId: user.id, role })}
                onCompanyEdit={() => handleCompanyEdit(user.id, user.company)}
                editingCompany={editingCompany === user.id}
                companyValue={companyValue}
                onCompanyValueChange={setCompanyValue}
                onCompanySave={() => handleCompanySave(user.id)}
                onCompanyCancel={() => setEditingCompany(null)}
                isUpdating={updateRoleMutation.isPending || updateCompanyMutation.isPending}
              />
            ))}
            {users.filter(u => u.role && u.role !== "pending").length === 0 && (
              <p className="text-center text-muted-foreground py-8">No active users yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface UserRowProps {
  user: User;
  onRoleChange: (role: string) => void;
  onCompanyEdit: () => void;
  editingCompany: boolean;
  companyValue: string;
  onCompanyValueChange: (value: string) => void;
  onCompanySave: () => void;
  onCompanyCancel: () => void;
  isUpdating: boolean;
}

function UserRow({
  user,
  onRoleChange,
  onCompanyEdit,
  editingCompany,
  companyValue,
  onCompanyValueChange,
  onCompanySave,
  onCompanyCancel,
  isUpdating,
}: UserRowProps) {
  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "exporter":
        return "default";
      case "importer":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 border rounded-lg" data-testid={`user-row-${user.id}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.profileImageUrl || undefined} />
          <AvatarFallback>
            {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.email || "Unknown User"}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{user.email || "No email"}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {editingCompany ? (
          <div className="flex items-center gap-2">
            <Input
              value={companyValue}
              onChange={(e) => onCompanyValueChange(e.target.value)}
              placeholder="Company name"
              className="w-48"
              data-testid="input-company"
            />
            <Button size="sm" onClick={onCompanySave} disabled={isUpdating} data-testid="button-save-company">
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={onCompanyCancel} data-testid="button-cancel-company">
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCompanyEdit}
            className="text-muted-foreground"
            data-testid="button-edit-company"
          >
            <Building2 className="h-4 w-4 mr-2" />
            {user.company || "Set Company"}
          </Button>
        )}

        <div className="flex items-center gap-2">
          <Badge variant={getRoleBadgeVariant(user.role)} data-testid={`badge-role-${user.id}`}>
            {user.role || "pending"}
          </Badge>
          <Select
            value={user.role || "pending"}
            onValueChange={onRoleChange}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-32" data-testid={`select-role-${user.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="exporter">Exporter</SelectItem>
              <SelectItem value="importer">Importer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
        </div>
      </div>
    </div>
  );
}
