
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Settings, Package2, FileText, TruckIcon, RefreshCwIcon, ArrowLeftRight, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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

  // Tracking UPI
  const [upiId, setUpiId] = useState("");
  
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

  const handleUpdateUPI = async () => {
    if (!upiId) {
      toast.error("Please enter a UPI ID");
      return;
    }
    
    setLoading(true);
    try {
      // In a real app, you would save this to the user's profile
      toast.success("UPI ID updated successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error updating UPI ID:", error);
      toast.error("Failed to update UPI ID");
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
      <motion.main 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
        className="flex-grow"
      >
        <div className="container mx-auto py-12 px-4">
          <div className="flex flex-col gap-6">
            <motion.div 
              variants={fadeIn}
              transition={{ delay: 0.1 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
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
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              transition={{ delay: 0.2 }}
              className="bg-black/40 border border-green-900/30 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6"
            >
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
            </motion.div>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-6 max-w-2xl">
                <TabsTrigger value="profile" className="data-[state=active]:bg-green-800">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="orders" className="data-[state=active]:bg-green-800">
                  <Package2 className="h-4 w-4 mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="tracking" className="data-[state=active]:bg-green-800">
                  <TruckIcon className="h-4 w-4 mr-2" />
                  Tracking
                </TabsTrigger>
                <TabsTrigger value="returns" className="data-[state=active]:bg-green-800">
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Returns
                </TabsTrigger>
                <TabsTrigger value="payment" className="data-[state=active]:bg-green-800">
                  <RefreshCwIcon className="h-4 w-4 mr-2" />
                  Payment
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-green-800">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
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
                </motion.div>
                
                <motion.div variants={fadeIn} transition={{ delay: 0.4 }}>
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
                </motion.div>
              </TabsContent>
              
              <TabsContent value="orders">
                <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
                  <Card className="bg-black/40 border-green-900/30">
                    <CardHeader>
                      <CardTitle className="text-green-300">Order History</CardTitle>
                      <CardDescription className="text-green-500">
                        View and manage your orders
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
                </motion.div>
              </TabsContent>
              
              <TabsContent value="tracking">
                <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
                  <Card className="bg-black/40 border-green-900/30">
                    <CardHeader>
                      <CardTitle className="text-green-300">Order Tracking</CardTitle>
                      <CardDescription className="text-green-500">
                        Track the status of your orders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <TruckIcon className="w-12 h-12 mx-auto text-green-300/40 mb-2" />
                        <h3 className="text-green-300 text-lg font-medium">No active shipments</h3>
                        <p className="text-green-500 mt-1">
                          When your orders ship, tracking information will appear here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="returns">
                <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
                  <Card className="bg-black/40 border-green-900/30">
                    <CardHeader>
                      <CardTitle className="text-green-300">Returns & Refunds</CardTitle>
                      <CardDescription className="text-green-500">
                        Manage your returns and view refund status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <ArrowLeftRight className="w-12 h-12 mx-auto text-green-300/40 mb-2" />
                        <h3 className="text-green-300 text-lg font-medium">No returns</h3>
                        <p className="text-green-500 mt-1">
                          You don't have any return requests or refunds
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4 border-green-800 text-green-300 hover:bg-green-900/20"
                          onClick={() => navigate("/returns")}
                        >
                          View Return Policy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="payment">
                <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
                  <Card className="bg-black/40 border-green-900/30">
                    <CardHeader>
                      <CardTitle className="text-green-300">Payment Methods</CardTitle>
                      <CardDescription className="text-green-500">
                        Manage your payment preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-green-300 text-lg font-medium">UPI Payment</h3>
                        <div className="space-y-2">
                          <Label htmlFor="upi-id" className="text-green-300">UPI ID</Label>
                          <Input
                            id="upi-id"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="yourname@upi"
                            className="bg-black/40 border-green-900/50 text-green-200"
                          />
                          <p className="text-xs text-green-500">
                            Enter your UPI ID to enable quick payments
                          </p>
                        </div>
                        <Button 
                          onClick={handleUpdateUPI}
                          disabled={loading}
                          className="bg-green-800 hover:bg-green-700 text-white"
                        >
                          {loading ? "Saving..." : "Save UPI ID"}
                        </Button>
                      </div>
                      
                      <Separator className="my-4 bg-green-900/30" />
                      
                      <div>
                        <h3 className="text-green-300 text-lg font-medium mb-4">How UPI Payments Work</h3>
                        <div className="bg-green-900/10 border border-green-900/30 rounded-lg p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="bg-green-900/30 text-green-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</div>
                            <p className="text-green-200">When you place an order, you'll be shown our UPI ID</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="bg-green-900/30 text-green-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</div>
                            <p className="text-green-200">Open your UPI app (Google Pay, PhonePe, Paytm, etc.) and send the payment</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="bg-green-900/30 text-green-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</div>
                            <p className="text-green-200">Your order will be confirmed once payment is received</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="settings">
                <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
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
                          <p className="font-medium text-green-300">Two-Factor Authentication</p>
                          <p className="text-sm text-green-500">Add an extra layer of security to your account</p>
                        </div>
                        <Button 
                          variant="outline"
                          className="border-green-900 text-green-300 hover:bg-green-900/20"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Enable
                        </Button>
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
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Account;
