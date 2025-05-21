
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "../types";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check auth state on initial load and on auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          try {
            // Check if user is admin based on email domain
            const isAdmin = session.user.email?.endsWith('@nature.com') || false;
            
            // Set user data
            setCurrentUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.full_name || '',
              isAdmin: isAdmin
            });
          } catch (error) {
            console.error("Error in auth state change:", error);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      }
    );

    // Initial session check
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          // Check if user is admin based on email domain
          const isAdmin = session.user.email?.endsWith('@nature.com') || false;
          
          // Set user data
          setCurrentUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || '',
            isAdmin: isAdmin
          });
        }
      } catch (error) {
        console.error("Error in checking session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Sign in with Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Signed in successfully!");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Failed to sign in. Please check your credentials.");
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      
      // Check if email contains '@nature.com' to determine admin status
      const isAdmin = email.endsWith('@nature.com');
      
      // Sign up with Supabase auth - No email confirmation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Auto sign-in after sign-up
        await signIn(email, password);
      }
      
      toast.success("Account created successfully!");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
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
