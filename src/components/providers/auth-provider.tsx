"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type User, type Tenant } from "@/types";

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ user: User; tenant: Tenant }>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<{ user: User; tenant: Tenant }>;
  switchTenant: (tenantId: string) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  company?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check localStorage for demo user
      const demoUser = localStorage.getItem("demo-user");
      const demoTenant = localStorage.getItem("demo-tenant");

      if (demoUser && demoTenant) {
        setUser(JSON.parse(demoUser));
        setTenant(JSON.parse(demoTenant));
        console.log("Demo user loaded:", JSON.parse(demoUser));
      } else {
        console.log("No demo user found");
        setUser(null);
        setTenant(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setTenant(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Demo authentication - accept any email/password for now
      console.log("Demo login attempt:", email);

      // Create demo user and tenant
      const demoUser: User = {
        id: "demo-user-1",
        email: email,
        name: "Demo User",
        avatar: undefined,
        role: "owner",
        tenantId: "demo-tenant-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const demoTenant: Tenant = {
        id: "demo-tenant-1",
        name: "Demo Company",
        slug: "demo-company",
        domain: "demo.rockket.dev",
        settings: {
          branding: {
            primaryColor: "#f97316",
            secondaryColor: "#fb923c",
          },
          features: {
            aiGenerator: true,
            visualBuilder: true,
            cms: true,
            ecommerce: true,
            analytics: true,
            billing: true,
          },
          integrations: {},
          notifications: {
            email: true,
            push: false,
            sms: false,
          },
        },
        plan: "professional",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store in localStorage
      localStorage.setItem("demo-user", JSON.stringify(demoUser));
      localStorage.setItem("demo-tenant", JSON.stringify(demoTenant));

      setUser(demoUser);
      setTenant(demoTenant);

      console.log("Demo login successful");
      return { user: demoUser, tenant: demoTenant };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("demo-user");
      localStorage.removeItem("demo-tenant");
      setUser(null);
      setTenant(null);
      console.log("Demo logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      console.log("Demo registration attempt:", userData.email);

      // Create demo user and tenant
      const demoUser: User = {
        id: "demo-user-1",
        email: userData.email,
        name: userData.name,
        avatar: undefined,
        role: "owner",
        tenantId: "demo-tenant-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const demoTenant: Tenant = {
        id: "demo-tenant-1",
        name: userData.company || "Demo Company",
        slug: "demo-company",
        domain: "demo.rockket.dev",
        settings: {
          branding: {
            primaryColor: "#f97316",
            secondaryColor: "#fb923c",
          },
          features: {
            aiGenerator: true,
            visualBuilder: true,
            cms: true,
            ecommerce: true,
            analytics: true,
            billing: true,
          },
          integrations: {},
          notifications: {
            email: true,
            push: false,
            sms: false,
          },
        },
        plan: "professional",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store in localStorage
      localStorage.setItem("demo-user", JSON.stringify(demoUser));
      localStorage.setItem("demo-tenant", JSON.stringify(demoTenant));

      setUser(demoUser);
      setTenant(demoTenant);

      console.log("Demo registration successful");
      return { user: demoUser, tenant: demoTenant };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const switchTenant = async (tenantId: string) => {
    // TODO: Implement tenant switching logic
    throw new Error("Tenant switching not implemented yet");
  };

  const value: AuthContextType = {
    user,
    tenant,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    switchTenant,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
