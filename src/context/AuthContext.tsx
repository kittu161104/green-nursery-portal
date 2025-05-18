
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "../types";
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = [
  {
    id: "1",
    email: "admin@nature.com",
    name: "Admin User",
    password: "password123",
    isAdmin: true,
  },
  {
    id: "2",
    email: "customer@gmail.com",
    name: "Customer User",
    password: "password123",
    isAdmin: false,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Mock authentication
      const user = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );
      
      if (!user) {
        throw new Error("Invalid credentials");
      }
      
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      toast.success("Signed in successfully!");
      
      return Promise.resolve();
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in. Please check your credentials.");
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      // Check if user already exists
      const existingUser = MOCK_USERS.find((u) => u.email === email);
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Determine if admin based on email domain
      const isAdmin = email.endsWith('@nature.com');
      
      // Create new user
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        email,
        name,
        isAdmin,
      };

      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      toast.success("Account created successfully!");
      
      return Promise.resolve();
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Failed to create account. Please try again.");
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toast.success("Signed out successfully!");
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    signOut,
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
