import { createContext, useContext, useState } from "react";
import type { UserRole } from "@shared/schema";

interface CurrentUser {
  id: string;
  username: string;
  role: UserRole;
  company: string;
  country: string;
  email: string;
}

interface UserContextType {
  user: CurrentUser;
  setRole: (role: UserRole) => void;
}

const defaultUser: CurrentUser = {
  id: "user-1",
  username: "admin",
  role: "exporter",
  company: "American MFG & MKT Association USA",
  country: "United States",
  email: "admin@zapp.com"
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser>(defaultUser);

  const setRole = (role: UserRole) => {
    setUser(prev => ({ ...prev, role }));
  };

  return (
    <UserContext.Provider value={{ user, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function useIsAdmin() {
  const { user } = useUser();
  return user.role === "admin";
}

export function useIsExporter() {
  const { user } = useUser();
  return user.role === "exporter" || user.role === "admin";
}

export function useIsImporter() {
  const { user } = useUser();
  return user.role === "importer" || user.role === "admin";
}
