import React, { createContext, useState, useContext, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  currentUser: {
    id: string;
    email: string;
    fullName: string | null;
    isAdmin: boolean;
  } | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName: string, adminCode?: string) => Promise<void>;
  signIn: (email: string, password: string, adminCode?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateAdminCode: (currentAdminCode: string, newAdminCode: string) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin code
const SYSTEM_ADMIN_CODE = "Natural.green.nursery";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthContextType["currentUser"]>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        // First, set up the auth state listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setSession(session);
            
            if (session?.user) {
              // Only do async work after setting the session
              setTimeout(async () => {
                await fetchUserData(session.user.id);
              }, 0);
            } else {
              setCurrentUser(null);
            }
          }
        );

        // Then check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          await fetchUserData(session.user.id);
        }
        
        setLoading(false);
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth setup error:", error);
        setLoading(false);
      }
    };
    
    setupAuth();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      // Check if user is admin
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError) {
        console.error("Error fetching user roles:", roleError);
      }

      const isAdmin = !!roleData;
      
      const authUser = await supabase.auth.getUser();
      
      setCurrentUser({
        id: userId,
        email: authUser.data.user?.email || '',
        fullName: profileData?.full_name || null,
        isAdmin
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Just set basic user info if we fail to get profile/role
      const authUser = await supabase.auth.getUser();
      
      setCurrentUser({
        id: userId,
        email: authUser.data.user?.email || '',
        fullName: null,
        isAdmin: false
      });
    }
  };

  const signUp = async (email: string, password: string, fullName: string, adminCode?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, full_name: fullName }]);
            
        if (profileError) throw profileError;
        
        // Check admin code and set role if valid
        const isAdmin = await checkAdminCode(adminCode);
        
        if (isAdmin) {
          // Set user as admin
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert([{ user_id: data.user.id, role: 'admin' }]);
            
          if (roleError) throw roleError;
        }
      }
      
      toast.success("Account created successfully! You can now sign in.");
    } catch (error: any) {
      console.error("Error signing up:", error);
      
      // Handle the specific rate limit error
      if (error.message && error.message.includes("rate limit")) {
        toast.error("Too many signup attempts. Please try again later.");
      } else {
        toast.error(error.message || "Failed to create account");
      }
      throw error;
    }
  };

  const signIn = async (email: string, password: string, adminCode?: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // If admin code provided, validate and update role if needed
      if (adminCode) {
        const isAdmin = await checkAdminCode(adminCode);
        
        if (isAdmin && data.user) {
          // Check if user already has admin role
          const { data: existingRole } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', data.user.id)
            .eq('role', 'admin')
            .maybeSingle();
            
          // Add admin role if not already present
          if (!existingRole) {
            await supabase
              .from('user_roles')
              .insert([{ user_id: data.user.id, role: 'admin' }]);
          }
        }
      }
      
      toast.success("Signed in successfully!");
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error(error.message || "Invalid email or password");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCurrentUser(null);
      toast.info("Signed out successfully");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error(error.message || "Failed to sign out");
    }
  };
  
  // Validate admin code against stored or default code
  const checkAdminCode = async (adminCode?: string): Promise<boolean> => {
    if (!adminCode) return false;
    
    // Check if it matches the system admin code
    if (adminCode === SYSTEM_ADMIN_CODE) return true;
    
    try {
      // Try to get the stored admin code from database using RPC function
      const { data, error } = await supabase
        .rpc('get_admin_code');
      
      if (error) {
        console.error("Error checking admin code:", error);
        // If no admin settings exist yet, use default code
        return false;
      }
      
      // The RPC function returns a result with admin_code property
      return adminCode === data;
    } catch (error) {
      console.error("Error checking admin code:", error);
      return false;
    }
  };
  
  // Update admin code (only for admins)
  const updateAdminCode = async (currentAdminCode: string, newAdminCode: string): Promise<boolean> => {
    try {
      // Verify the current admin has permission to update the code
      const isAdmin = await checkAdminCode(currentAdminCode);
      
      if (!isAdmin) {
        toast.error("Invalid admin code. Cannot update settings.");
        return false;
      }
      
      // Use RPC function to update admin code
      const { data, error } = await supabase
        .rpc('update_admin_code', { 
          current_code: currentAdminCode,
          new_code: newAdminCode
        });
      
      if (error) throw error;
      
      toast.success("Admin code updated successfully");
      return true;
    } catch (error: any) {
      console.error("Error updating admin code:", error);
      toast.error(error.message || "Failed to update admin code");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        session,
        signUp,
        signIn,
        signOut,
        updateAdminCode,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
