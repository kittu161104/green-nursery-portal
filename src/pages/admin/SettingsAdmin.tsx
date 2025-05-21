import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SideNavAdmin from "@/components/admin/SideNavAdmin";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Globe, CreditCard, Mail, Bell, Shield, Lock } from "lucide-react";
import AdminCodeSettings from "@/components/admin/AdminCodeSettings";

const SettingsAdmin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // General settings
  const [storeName, setStoreName] = useState("Natural Green Nursery");
  const [storeEmail, setStoreEmail] = useState("contact@naturalgreenursery.com");
  const [storeCurrency, setStoreCurrency] = useState("INR");
  const [storeLanguage, setStoreLanguage] = useState("en");
  const [storeTimeZone, setStoreTimeZone] = useState("Asia/Kolkata");
  
  // Email settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderConfirmations, setOrderConfirmations] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [emailFooter, setEmailFooter] = useState("");
  
  // Payment settings
  const [acceptCashOnDelivery, setAcceptCashOnDelivery] = useState(true);
  const [acceptUPI, setAcceptUPI] = useState(true);
  const [upiId, setUpiId] = useState("");
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  // Handle save settings
  const handleSaveGeneralSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("General settings saved successfully");
    }, 800);
  };
  
  const handleSaveEmailSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Email settings saved successfully");
    }, 800);
  };
  
  const handleSavePaymentSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Payment settings saved successfully");
    }, 800);
  };
  
  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavAdmin />
      
      <div className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-green-300">Settings</h1>
            <p className="text-green-500">Configure your store settings</p>
          </div>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-4 bg-green-900/20">
              <TabsTrigger value="general" className="data-[state=active]:bg-green-800 text-green-300">
                <Settings className="w-4 h-4 mr-2" /> General
              </TabsTrigger>
              <TabsTrigger value="email" className="data-[state=active]:bg-green-800 text-green-300">
                <Mail className="w-4 h-4 mr-2" /> Email
              </TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-green-800 text-green-300">
                <CreditCard className="w-4 h-4 mr-2" /> Payment
              </TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-green-800 text-green-300">
                <Lock className="w-4 h-4 mr-2" /> Admin
              </TabsTrigger>
            </TabsList>
            
            {/* General Settings Tab */}
            <TabsContent value="general">
              <Card className="bg-black/40 border-green-900/30">
                <CardHeader>
                  <CardTitle className="text-green-300 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Store Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="store-name" className="text-green-300">Store Name</Label>
                      <Input 
                        id="store-name" 
                        value={storeName} 
                        onChange={(e) => setStoreName(e.target.value)}
                        className="bg-black/40 border-green-900/50 text-green-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="store-email" className="text-green-300">Store Email</Label>
                      <Input 
                        id="store-email"
                        type="email" 
                        value={storeEmail} 
                        onChange={(e) => setStoreEmail(e.target.value)}
                        className="bg-black/40 border-green-900/50 text-green-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="store-currency" className="text-green-300">Currency</Label>
                      <Select value={storeCurrency} onValueChange={setStoreCurrency}>
                        <SelectTrigger className="bg-black/40 border-green-900/50 text-green-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/80 backdrop-blur-md border-green-900/50">
                          <SelectItem value="INR" className="text-green-300">Indian Rupee (₹)</SelectItem>
                          <SelectItem value="USD" className="text-green-300">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR" className="text-green-300">Euro (€)</SelectItem>
                          <SelectItem value="GBP" className="text-green-300">British Pound (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="store-language" className="text-green-300">Language</Label>
                      <Select value={storeLanguage} onValueChange={setStoreLanguage}>
                        <SelectTrigger className="bg-black/40 border-green-900/50 text-green-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/80 backdrop-blur-md border-green-900/50">
                          <SelectItem value="en" className="text-green-300">English</SelectItem>
                          <SelectItem value="hi" className="text-green-300">Hindi</SelectItem>
                          <SelectItem value="ta" className="text-green-300">Tamil</SelectItem>
                          <SelectItem value="te" className="text-green-300">Telugu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="store-timezone" className="text-green-300">Time Zone</Label>
                      <Select value={storeTimeZone} onValueChange={setStoreTimeZone}>
                        <SelectTrigger className="bg-black/40 border-green-900/50 text-green-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/80 backdrop-blur-md border-green-900/50">
                          <SelectItem value="Asia/Kolkata" className="text-green-300">Indian Standard Time (IST)</SelectItem>
                          <SelectItem value="UTC" className="text-green-300">Coordinated Universal Time (UTC)</SelectItem>
                          <SelectItem value="America/New_York" className="text-green-300">Eastern Time (ET)</SelectItem>
                          <SelectItem value="Europe/London" className="text-green-300">Greenwich Mean Time (GMT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-green-900/30">
                    <h3 className="text-lg font-medium text-green-300 mb-4">Inventory Settings</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="low-stock-notification" className="text-green-300">Low Stock Notifications</Label>
                        <p className="text-sm text-green-500">Get notified when product stock is low</p>
                      </div>
                      <Switch id="low-stock-notification" checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <div className="space-y-0.5">
                        <Label htmlFor="hide-out-of-stock" className="text-green-300">Hide Out of Stock Products</Label>
                        <p className="text-sm text-green-500">Hide products that are out of stock</p>
                      </div>
                      <Switch id="hide-out-of-stock" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="bg-green-800 hover:bg-green-700 text-green-300" 
                    onClick={handleSaveGeneralSettings}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Email Settings Tab */}
            <TabsContent value="email">
              <Card className="bg-black/40 border-green-900/30">
                <CardHeader>
                  <CardTitle className="text-green-300 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications" className="text-green-300">Email Notifications</Label>
                      <p className="text-sm text-green-500">Enable email notifications</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-green-900/30">
                    <h3 className="text-lg font-medium text-green-300 mb-4">Notification Types</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="order-confirmations" className="text-green-300">Order Confirmations</Label>
                          <p className="text-sm text-green-500">Send order confirmation emails</p>
                        </div>
                        <Switch 
                          id="order-confirmations" 
                          checked={orderConfirmations} 
                          onCheckedChange={setOrderConfirmations}
                          disabled={!emailNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="stock-alerts" className="text-green-300">Stock Alerts</Label>
                          <p className="text-sm text-green-500">Receive low stock alert emails</p>
                        </div>
                        <Switch 
                          id="stock-alerts" 
                          checked={stockAlerts} 
                          onCheckedChange={setStockAlerts}
                          disabled={!emailNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="marketing-emails" className="text-green-300">Marketing Emails</Label>
                          <p className="text-sm text-green-500">Send promotional emails to customers</p>
                        </div>
                        <Switch 
                          id="marketing-emails" 
                          checked={marketingEmails} 
                          onCheckedChange={setMarketingEmails}
                          disabled={!emailNotifications}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-green-900/30 space-y-2">
                    <Label htmlFor="email-footer" className="text-green-300">Email Footer</Label>
                    <Textarea 
                      id="email-footer" 
                      value={emailFooter} 
                      onChange={(e) => setEmailFooter(e.target.value)}
                      placeholder="Add a footer text for all outgoing emails"
                      className="bg-black/40 border-green-900/50 text-green-300 min-h-[100px]"
                      disabled={!emailNotifications}
                    />
                    <p className="text-xs text-green-500">
                      This text will appear at the bottom of all emails sent from your store.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="bg-green-800 hover:bg-green-700 text-green-300" 
                    onClick={handleSaveEmailSettings}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Email Settings"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Payment Settings Tab - UPDATED FOR UPI & CASH ON DELIVERY ONLY */}
            <TabsContent value="payment">
              <Card className="bg-black/40 border-green-900/30">
                <CardHeader>
                  <CardTitle className="text-green-300 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="cash-on-delivery" className="text-green-300">Cash On Delivery</Label>
                        <p className="text-sm text-green-500">Allow customers to pay when they receive their order</p>
                      </div>
                      <Switch 
                        id="cash-on-delivery" 
                        checked={acceptCashOnDelivery} 
                        onCheckedChange={setAcceptCashOnDelivery}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="upi" className="text-green-300">UPI Payments</Label>
                        <p className="text-sm text-green-500">Accept UPI payments</p>
                      </div>
                      <Switch 
                        id="upi" 
                        checked={acceptUPI} 
                        onCheckedChange={setAcceptUPI}
                      />
                    </div>
                  </div>
                  
                  {acceptUPI && (
                    <div className="pt-4 border-t border-green-900/30">
                      <h3 className="text-lg font-medium text-green-300 mb-4">UPI Settings</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="upi-id" className="text-green-300">Your UPI ID</Label>
                        <Input 
                          id="upi-id" 
                          value={upiId} 
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="example@ybl"
                          className="bg-black/40 border-green-900/50 text-green-300"
                        />
                        <p className="text-xs text-green-500">
                          Customers will use this UPI ID to make payments. Make sure it's correct.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="bg-green-800 hover:bg-green-700 text-green-300" 
                    onClick={handleSavePaymentSettings}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Payment Settings"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Admin Settings Tab - NEW */}
            <TabsContent value="admin">
              <AdminCodeSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;
