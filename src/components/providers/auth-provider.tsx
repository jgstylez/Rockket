"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type User, type Tenant } from "@/types";

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
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
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        console.log("Auth check successful:", data);
        setUser(data.user);
        setTenant(data.user.tenant);
      } else {
        console.log("Auth check failed:", response.status, response.statusText);
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setTenant(data.user.tenant);
        return data;
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      setUser(null);
      setTenant(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setTenant(data.tenant);
        return data;
      } else {
        throw new Error(data.error || "Registration failed");
      }
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
