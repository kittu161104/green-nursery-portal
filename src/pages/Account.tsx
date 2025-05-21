import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Settings, Package2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Account = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Profile info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    
    if (currentUser) {
      setName(currentUser.fullName || "");
      setEmail(currentUser.email);
    }
  }, [currentUser, navigate]);
  
  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      toast.success("Password changed successfully!");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to get initials from name
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (!currentUser) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto py-12 px-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-green-300">My Account</h1>
                <p className="text-green-500">Manage your profile and preferences</p>
              </div>
              
              <Button 
                variant="outline" 
                className="border-red-800 text-red-400 hover:bg-red-950 hover:text-red-300"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </div>
            
            <div className="bg-black/40 border border-green-900/30 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback className="bg-green-800 text-green-100 text-xl">
                  {getInitials(currentUser.fullName || "")}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-xl font-semibold text-green-300">{currentUser.fullName || "User"}</h2>
                <p className="text-green-500">{currentUser.email}</p>
                {currentUser.isAdmin && (
                  <div className="mt-2">
                    <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded-md text-xs">
                      Administrator
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-3 max-w-md">
                <TabsTrigger value="profile" className="data-[state=active]:bg-green-800">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="orders" className="data-[state=active]:bg-green-800">
                  <Package2 className="h-4 w-4 mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-green-800">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card className="bg-black/40 border-green-900/30">
                  <CardHeader>
                    <CardTitle className="text-green-300">Profile Information</CardTitle>
                    <CardDescription className="text-green-500">
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-green-300">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-black/40 border-green-900/50 text-green-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-green-300">Email Address</Label>
                      <Input
                        id="email"
                        value={email}
                        disabled
                        className="bg-black/40 border-green-900/50 text-green-200 opacity-70"
                      />
                      <p className="text-xs text-green-500">
                        Contact support to change your email address
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="bg-green-800 hover:bg-green-700 text-green-100"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-black/40 border-green-900/30 mt-6">
                  <CardHeader>
                    <CardTitle className="text-green-300">Change Password</CardTitle>
                    <CardDescription className="text-green-500">
                      Update your password to secure your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-green-300">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-black/40 border-green-900/50 text-green-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-green-300">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-black/40 border-green-900/50 text-green-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-green-300">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="bg-black/40 border-green-900/50 text-green-200"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="border-green-900 text-green-300 hover:bg-green-900/20"
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders">
                <Card className="bg-black/40 border-green-900/30">
                  <CardHeader>
                    <CardTitle className="text-green-300">Order History</CardTitle>
                    <CardDescription className="text-green-500">
                      View and track your orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto text-green-300/40 mb-2" />
                      <h3 className="text-green-300 text-lg font-medium">No orders yet</h3>
                      <p className="text-green-500 mt-1">
                        When you make a purchase, your orders will appear here
                      </p>
                      <Button
                        className="mt-4 bg-green-800 hover:bg-green-700"
                        onClick={() => navigate("/shop")}
                      >
                        Browse Products
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card className="bg-black/40 border-green-900/30">
                  <CardHeader>
                    <CardTitle className="text-green-300">Account Settings</CardTitle>
                    <CardDescription className="text-green-500">
                      Manage your account preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-300">Email Notifications</p>
                        <p className="text-sm text-green-500">Receive updates about your orders and promotions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator className="my-4 bg-green-900/30" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-300">SMS Notifications</p>
                        <p className="text-sm text-green-500">Get SMS alerts for order updates</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator className="my-4 bg-green-900/30" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-300">Delete Account</p>
                        <p className="text-sm text-red-500">Permanently delete your account and all associated data</p>
                      </div>
                      <Button 
                        variant="outline"
                        className="border-red-900 text-red-400 hover:bg-red-950 hover:text-red-300"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
