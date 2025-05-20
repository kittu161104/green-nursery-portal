
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SideNavAdmin from "@/components/admin/SideNavAdmin";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { Settings, ShieldCheck, Mail, Truck, RotateCcw, FileEdit, Globe } from "lucide-react";

const SettingsAdmin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  
  // General settings
  const [storeName, setStoreName] = useState("Natural Green Nursery");
  const [storeTagline, setStoreTagline] = useState("Your one-stop shop for all houseplants");
  const [storeLogo, setStoreLogo] = useState("");
  const [enableFeaturedProducts, setEnableFeaturedProducts] = useState(true);
  const [featuredProductsCount, setFeaturedProductsCount] = useState(4);
  
  // Email settings
  const [contactEmail, setContactEmail] = useState("contact@naturalgreenursery.com");
  const [supportEmail, setSupportEmail] = useState("support@naturalgreenursery.com");
  const [orderNotificationsEmail, setOrderNotificationsEmail] = useState("orders@naturalgreenursery.com");
  const [enableOrderConfirmationEmails, setEnableOrderConfirmationEmails] = useState(true);
  const [enableShippingUpdateEmails, setEnableShippingUpdateEmails] = useState(true);
  
  // Shipping settings
  const [defaultShippingMethod, setDefaultShippingMethod] = useState("standard");
  const [standardShippingCost, setStandardShippingCost] = useState(99);
  const [expressShippingCost, setExpressShippingCost] = useState(199);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1000);
  const [enableFreeShipping, setEnableFreeShipping] = useState(true);
  
  // Returns settings
  const [returnPeriodDays, setReturnPeriodDays] = useState(7);
  const [refundProcessingDays, setRefundProcessingDays] = useState(5);
  const [returnPolicy, setReturnPolicy] = useState("We accept returns of plants within 7 days if they arrive damaged or unhealthy. Other items can be returned within 30 days in their original packaging.");
  
  // Content settings
  const [seoTitle, setSeoTitle] = useState("Natural Green Nursery - Indoor & Outdoor Plants");
  const [seoDescription, setSeoDescription] = useState("Shop the best collection of indoor and outdoor plants, planters, and gardening accessories at Natural Green Nursery. Free shipping on orders over ₹1000.");
  const [enableBlog, setEnableBlog] = useState(false);
  const [enableReviews, setEnableReviews] = useState(true);
  
  // Security settings
  const [requireEmailVerification, setRequireEmailVerification] = useState(false);
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [sessionTimeout, setSessionTimeout] = useState(60); // minutes

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // In a real app, we'd fetch these settings from the database
    // Here we're just using preset values for demonstration
    const fetchSettings = async () => {
      try {
        // This would ideally fetch from a settings table in your database
        // For now, we're just using the preset values
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    if (currentUser?.isAdmin) {
      fetchSettings();
    }
  }, [currentUser]);

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      // For demonstration purposes, let's assume we're saving to a settings table
      // In a real app, you would implement proper settings persistence
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update data based on the active tab
      if (activeTab === "shipping") {
        // Update shipping_info table with the new shipping costs
        const { error } = await supabase
          .from('shipping_info')
          .update({
            content: `<p>We ship across India with multiple shipping options. Usually, orders are processed within 1-2 business days.</p>
                      <h3>Shipping Methods</h3>
                      <ul>
                        <li>Standard Shipping (3-5 business days): ₹${standardShippingCost}</li>
                        <li>Express Shipping (1-2 business days): ₹${expressShippingCost}</li>
                      </ul>
                      <h3>Free Shipping</h3>
                      <p>${enableFreeShipping ? `Orders over ₹${freeShippingThreshold} qualify for free standard shipping.` : 'Free shipping is currently not available.'}</p>
                      <h3>Important Notes</h3>
                      <p>For plant orders, we carefully package plants to ensure they arrive in excellent condition. If your plant arrives damaged, please contact us within 24 hours with photos.</p>`
          })
          .eq('id', 1);
          
        if (error) {
          throw new Error(`Error updating shipping info: ${error.message}`);
        }
      }
      
      if (activeTab === "returns") {
        // Update returns_info table with the new return policy
        const { error } = await supabase
          .from('returns_info')
          .update({
            content: `<p>We want you to be completely satisfied with your purchase. If for any reason you're not happy with your order, we're here to help.</p>
                      <h3>Return Policy</h3>
                      <ul>
                        <li>Plants: Returns accepted within ${returnPeriodDays} days of delivery if plant is unhealthy upon arrival</li>
                        <li>Plant Accessories: Returns accepted within 30 days if unused and in original packaging</li>
                      </ul>
                      <h3>How to Return</h3>
                      <p>To initiate a return, please email us at ${supportEmail} with your order number and reason for return. We'll provide you with return instructions.</p>
                      <h3>Refund Process</h3>
                      <p>Once we receive your return, we'll inspect the item and process your refund within ${refundProcessingDays}-7 business days. Refunds will be issued to the original payment method.</p>
                      <h3>Additional Return Policy Information</h3>
                      <p>${returnPolicy}</p>`
          })
          .eq('id', 1);
          
        if (error) {
          throw new Error(`Error updating returns info: ${error.message}`);
        }
      }
      
      // Success message
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(`Failed to save settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
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
            <h1 className="text-3xl font-bold text-green-300">Store Settings</h1>
            <p className="text-green-400">Configure your store settings and preferences</p>
          </div>
          
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-black/40 border border-green-900/30">
              <TabsTrigger value="general" className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-300">
                <Settings className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="email" className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-300">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="shipping" className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-300">
                <Truck className="h-4 w-4 mr-2" />
                Shipping
              </TabsTrigger>
              <TabsTrigger value="returns" className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-300">
                <RotateCcw className="h-4 w-4 mr-2" />
                Returns
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-300">
                <FileEdit className="h-4 w-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-300">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card className="bg-black/40 border-green-900/30 shadow-md">
                <CardHeader>
                  <CardTitle className="text-green-300">General Settings</CardTitle>
                  <CardDescription className="text-green-400">
                    Configure basic store information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                    <Label htmlFor="store-tagline" className="text-green-300">Store Tagline</Label>
                    <Input
                      id="store-tagline"
                      value={storeTagline}
                      onChange={(e) => setStoreTagline(e.target.value)}
                      className="bg-black/40 border-green-900/50 text-green-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-logo" className="text-green-300">Store Logo URL</Label>
                    <Input
                      id="store-logo"
                      value={storeLogo}
                      onChange={(e) => setStoreLogo(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="bg-black/40 border-green-900/50 text-green-300"
                    />
                  </div>
                  
                  <Separator className="my-4 bg-green-900/30" />
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-green-300">Homepage Settings</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="featured-products" className="text-green-300">Enable Featured Products</Label>
                        <p className="text-sm text-green-400">Display featured products on the homepage</p>
                      </div>
                      <Switch
                        id="featured-products"
                        checked={enableFeaturedProducts}
                        onCheckedChange={setEnableFeaturedProducts}
                      />
                    </div>
                    
                    {enableFeaturedProducts && (
                      <div className="space-y-2">
                        <Label htmlFor="featured-count" className="text-green-300">Number of Featured Products</Label>
                        <Input
                          id="featured-count"
                          type="number"
                          value={featuredProductsCount}
                          onChange={(e) => setFeaturedProductsCount(parseInt(e.target.value))}
                          min={1}
                          max={12}
                          className="bg-black/40 border-green-900/50 text-green-300"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSaveSettings} 
                    disabled={saving}
                    className="bg-green-800 hover:bg-green-700 text-green-300"
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="email">
              <Card className="bg-black/40 border-green-900/30 shadow-md">
                <CardHeader>
                  <CardTitle className="text-green-300">Email Settings</CardTitle>
                  <CardDescription className="text-green-400">
                    Configure email addresses and notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-green-300">Contact Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="bg-black/40 border-green-900/50 text-green-300"
                    />
                    <p className="text-sm text-green-400">Used for the contact form and general inquiries</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="support-email" className="text-green-300">Support Email</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="bg-black/40 border-green-900/50 text-green-300"
                    />
                    <p className="text-sm text-green-400">Used for customer support inquiries</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="order-email" className="text-green-300">Order Notifications Email</Label>
                    <Input
                      id="order-email"
                      type="email"
                      value={orderNotificationsEmail}
                      onChange={(e) => setOrderNotificationsEmail(e.target.value)}
                      className="bg-black/40 border-green-900/50 text-green-300"
                    />
                    <p className="text-sm text-green-400">Where new order notifications will be sent</p>
                  </div>
                  
                  <Separator className="my-4 bg-green-900/30" />
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-green-300">Email Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="order-confirmation" className="text-green-300">Order Confirmation Emails</Label>
                        <p className="text-sm text-green-400">Send confirmation emails to customers when they place an order</p>
                      </div>
                      <Switch
                        id="order-confirmation"
                        checked={enableOrderConfirmationEmails}
                        onCheckedChange={setEnableOrderConfirmationEmails}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="shipping-update" className="text-green-300">Shipping Update Emails</Label>
                        <p className="text-sm text-green-400">Send emails when an order's shipping status changes</p>
                      </div>
                      <Switch
                        id="shipping-update"
                        checked={enableShippingUpdateEmails}
                        onCheckedChange={setEnableShippingUpdateEmails}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSaveSettings} 
                    disabled={saving}
                    className="bg-green-800 hover:bg-green-700 text-green-300"
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipping">
              <Card className="bg-black/40 border-green-900/30 shadow-md">
                <CardHeader>
                  <CardTitle className="text-green-300">Shipping Settings</CardTitle>
                  <CardDescription className="text-green-400">
                    Configure shipping methods and costs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="default-shipping" className="text-green-300">Default Shipping Method</Label>
                    <select
                      id="default-shipping"
                      value={defaultShippingMethod}
                      onChange={(e) => setDefaultShippingMethod(e.target.value)}
                      className="w-full bg-black/40 border-green-900/50 text-green-300 p-2 rounded-md"
                    >
                      <option value="standard">Standard Shipping</option>
                      <option value="express">Express Shipping</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="standard-cost" className="text-green-300">Standard Shipping Cost (₹)</Label>
                      <Input
                        id="standard-cost"
                        type="number"
                        value={standardShippingCost}
                        onChange={(e) => setStandardShippingCost(parseInt(e.target.value))}
                        min={0}
                        className="bg-black/40 border-green-900/50 text-green-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="express-cost" className="text-green-300">Express Shipping Cost (₹)</Label>
                      <Input
                        id="express-cost"
                        type="number"
                        value={expressShippingCost}
                        onChange={(e) => setExpressShippingCost(parseInt(e.target.value))}
                        min={0}
                        className="bg-black/40 border-green-900/50 text-green-300"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="free-shipping" className="text-green-300">Enable Free Shipping</Label>
                      <p className="text-sm text-green-400">Offer free shipping for orders above a certain amount</p>
                    </div>
                    <Switch
                      id="free-shipping"
                      checked={enableFreeShipping}
                      onCheckedChange={setEnableFreeShipping}
                    />
                  </div>
                  
                  {enableFreeShipping && (
                    <div className="space-y-2">
                      <Label htmlFor="free-threshold" className="text-green-300">Free Shipping Threshold (₹)</Label>
                      <Input
                        id="free-threshold"
                        type="number"
                        value={freeShippingThreshold}
                        onChange={(e) => setFreeShippingThreshold(parseInt(e.target.value))}
                        min={0}
                        className="bg-black/40 border-green-900/50 text-green-300"
                      />
                      <p className="text-sm text-green-400">Orders above this amount qualify for free shipping</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSaveSettings} 
                    disabled={saving}
                    className="bg-green-800 hover:bg-green-700 text-green-300"
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="returns">
              <Card className="bg-black/40 border-green-900/30 shadow-md">
                <CardHeader>
                  <CardTitle className="text-green-300">Returns & Refunds Settings</CardTitle>
                  <CardDescription className="text-green-400">
                    Configure return policy and refund processing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="return-period" className="text-green-300">Return Period (Days)</Label>
                      <Input
                        id="return-period"
                        type="number"
                        value={returnPeriodDays}
                        onChange={(e) => setReturnPeriodDays(parseInt(e.target.value))}
                        min={0}
                        className="bg-black/40 border-green-900/50 text-green-300"
                      />
                      <p className="text-sm text-green-400">Number of days customers have to return plant products</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="refund-days" className="text-green-300">Refund Processing Time (Days)</Label>
                      <Input
                        id="refund-days"
                        type="number"
                        value={refundProcessingDays}
                        onChange={(e) => setRefundProcessingDays(parseInt(e.target.value))}
                        min={1}
                        className="bg-black/40 border-green-900/50 text-green-300"
                      />
                      <p className="text-sm text-green-400">Typical number of days to process refunds</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="return-policy" className="text-green-300">Return Policy</Label>
                    <Textarea
                      id="return-policy"
                      value={returnPolicy}
                      onChange={(e) => setReturnPolicy(e.target.value)}
                      rows={6}
                      className="bg-black/40 border-green-900/50 text-green-300"
                    />
                    <p className="text-sm text-green-400">Detailed return policy information displayed to customers</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSaveSettings} 
                    disabled={saving}
                    className="bg-green-800 hover:bg-green-700 text-green-300"
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="content">
              <Card className="bg-black/40 border-green-900/30 shadow-md">
                <CardHeader>
                  <CardTitle className="text-green-300">Content & SEO Settings</CardTitle>
                  <CardDescription className="text-green-400">
                    Configure website content and SEO parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="seo-title" className="text-green-300">SEO Title</Label>
                    <Input
                      id="seo-title"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="bg-black/40 border-green-900/50 text-green-300"
                    />
                    <p className="text-sm text-green-400">Main title used for search engine results</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="seo-description" className="text-green-300">SEO Description</Label>
                    <Textarea
                      id="seo-description"
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      rows={3}
                      className="bg-black/40 border-green-900/50 text-green-300"
                    />
                    <p className="text-sm text-green-400">Description shown in search engine results</p>
                  </div>
                  
                  <Separator className="my-4 bg-green-900/30" />
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium text-green-300">Website Features</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-blog" className="text-green-300">Blog</Label>
                        <p className="text-sm text-green-400">Enable the blog section on your website</p>
                      </div>
                      <Switch
                        id="enable-blog"
                        checked={enableBlog}
                        onCheckedChange={setEnableBlog}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-reviews" className="text-green-300">Product Reviews</Label>
                        <p className="text-sm text-green-400">Allow customers to leave reviews on products</p>
                      </div>
                      <Switch
                        id="enable-reviews"
                        checked={enableReviews}
                        onCheckedChange={setEnableReviews}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSaveSettings} 
                    disabled={saving}
                    className="bg-green-800 hover:bg-green-700 text-green-300"
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card className="bg-black/40 border-green-900/30 shadow-md">
                <CardHeader>
                  <CardTitle className="text-green-300">Security Settings</CardTitle>
                  <CardDescription className="text-green-400">
                    Configure security and authentication parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-verification" className="text-green-300">Require Email Verification</Label>
                      <p className="text-sm text-green-400">Users must verify their email before logging in</p>
                    </div>
                    <Switch
                      id="email-verification"
                      checked={requireEmailVerification}
                      onCheckedChange={setRequireEmailVerification}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-length" className="text-green-300">Minimum Password Length</Label>
                    <Input
                      id="password-length"
                      type="number"
                      value={passwordMinLength}
                      onChange={(e) => setPasswordMinLength(parseInt(e.target.value))}
                      min={6}
                      max={16}
                      className="bg-black/40 border-green-900/50 text-green-300"
                    />
                    <p className="text-sm text-green-400">Minimum number of characters required for passwords</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout" className="text-green-300">Session Timeout (Minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                      min={5}
                      className="bg-black/40 border-green-900/50 text-green-300"
                    />
                    <p className="text-sm text-green-400">User session expiration time in minutes</p>
                  </div>
                  
                  <Separator className="my-4 bg-green-900/30" />
                  
                  <div>
                    <h3 className="text-xl font-medium text-green-300 mb-2">Access Control</h3>
                    <p className="text-green-400 mb-4">
                      To change authentication settings in Supabase, you need to visit the Supabase dashboard.
                    </p>
                    <Button variant="outline" className="border-green-900/50 text-green-300 hover:bg-green-900/20">
                      <Globe className="mr-2 h-4 w-4" />
                      Open Supabase Dashboard
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSaveSettings} 
                    disabled={saving}
                    className="bg-green-800 hover:bg-green-700 text-green-300"
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;
