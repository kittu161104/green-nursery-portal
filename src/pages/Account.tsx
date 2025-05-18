
import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Heart, 
  Package, 
  Truck, 
  RotateCcw, 
  History,
  User,
  Calendar,
  AlarmClock
} from "lucide-react";

const Account = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState("dashboard");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    } else if (currentUser.isAdmin) {
      navigate("/admin");
    } else {
      setName(currentUser.name);
      setEmail(currentUser.email);
      
      // Set active tab based on URL parameter if it exists
      if (tabParam) {
        setActiveTab(tabParam);
      }
    }
  }, [currentUser, navigate, tabParam]);

  if (!currentUser) {
    return null; // Will redirect to signin
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This is a mock implementation since we don't have a real backend
    setTimeout(() => {
      toast.success("Profile updated successfully");
      setLoading(false);
    }, 1000);
  };

  const plantCareReminders = [
    {
      id: "1",
      plantName: "Monstera Deliciosa",
      taskType: "Water",
      dueDate: new Date(Date.now() + 86400000 * 3).toLocaleDateString(),
      image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: "2",
      plantName: "Peace Lily",
      taskType: "Fertilize",
      dueDate: new Date(Date.now() + 86400000 * 7).toLocaleDateString(),
      image: "https://images.unsplash.com/photo-1567331711402-509c12c41959?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    }
  ];

  const mockOrders = [
    {
      id: "ORD-12345",
      date: "2025-05-10",
      status: "Delivered",
      total: 89.97,
      items: [
        { name: "Snake Plant", quantity: 1, price: 29.99 },
        { name: "Potting Soil", quantity: 2, price: 29.99 }
      ]
    },
    {
      id: "ORD-12346",
      date: "2025-05-15",
      status: "Processing",
      total: 45.99,
      items: [
        { name: "Spider Plant", quantity: 1, price: 24.99 },
        { name: "Ceramic Pot", quantity: 1, price: 21.00 }
      ]
    }
  ];

  const wishlistItems = [
    {
      id: "prod-1",
      name: "Fiddle Leaf Fig",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1599738578509-dc9701e13508?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: "prod-2",
      name: "Boston Fern",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1603436326446-74e0360c84ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: "prod-3",
      name: "ZZ Plant",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1572633424705-d813d2fb5cb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-green-300">My Account</h1>
            <Button 
              variant="outline" 
              onClick={signOut}
              className="bg-transparent border-green-800 text-green-400 hover:bg-green-900/20 hover:text-green-300"
            >
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8 bg-green-900/20 border border-green-900/30">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-green-800 data-[state=active]:text-green-50 text-green-400"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="orders"
                className="data-[state=active]:bg-green-800 data-[state=active]:text-green-50 text-green-400"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="tracking"
                className="data-[state=active]:bg-green-800 data-[state=active]:text-green-50 text-green-400"
              >
                Tracking
              </TabsTrigger>
              <TabsTrigger 
                value="returns"
                className="data-[state=active]:bg-green-800 data-[state=active]:text-green-50 text-green-400"
              >
                Returns
              </TabsTrigger>
              <TabsTrigger 
                value="wishlist"
                className="data-[state=active]:bg-green-800 data-[state=active]:text-green-50 text-green-400"
              >
                Wishlist
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-green-800 data-[state=active]:text-green-50 text-green-400"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-green-300">Welcome back, {currentUser.name}!</CardTitle>
                  <CardDescription className="text-green-500">
                    Here's a summary of your account activity.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-900/20 p-4 rounded-lg border border-green-900/30">
                      <p className="text-sm text-green-500">Recent Orders</p>
                      <p className="text-2xl font-bold text-green-300">{mockOrders.length}</p>
                    </div>
                    <div className="bg-green-900/20 p-4 rounded-lg border border-green-900/30">
                      <p className="text-sm text-green-500">Wishlist Items</p>
                      <p className="text-2xl font-bold text-green-300">{wishlistItems.length}</p>
                    </div>
                    <div className="bg-green-900/20 p-4 rounded-lg border border-green-900/30">
                      <p className="text-sm text-green-500">Plant Points</p>
                      <p className="text-2xl font-bold text-green-300">150</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 text-green-300">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link to="/shop">
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent border-green-800 text-green-400 hover:bg-green-900/20 hover:text-green-300"
                        >
                          Browse Plants
                        </Button>
                      </Link>
                      <Link to="/cart">
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent border-green-800 text-green-400 hover:bg-green-900/20 hover:text-green-300"
                        >
                          View Cart
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent border-green-800 text-green-400 hover:bg-green-900/20 hover:text-green-300"
                        onClick={() => setActiveTab("tracking")}
                      >
                        Track Orders
                      </Button>
                      <Link to="/plant-care-guides">
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent border-green-800 text-green-400 hover:bg-green-900/20 hover:text-green-300"
                        >
                          Plant Care Help
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-green-300">Plant Care Reminders</CardTitle>
                  <CardDescription className="text-green-500">
                    Upcoming tasks for your plants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {plantCareReminders.length > 0 ? (
                    <div className="space-y-4">
                      {plantCareReminders.map((reminder) => (
                        <div key={reminder.id} className="flex items-center space-x-4 p-3 bg-green-900/10 rounded-lg border border-green-900/20">
                          <div className="h-12 w-12 rounded-md overflow-hidden">
                            <img src={reminder.image} alt={reminder.plantName} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-green-300 font-medium">{reminder.plantName}</h4>
                            <div className="flex items-center text-green-500 text-sm">
                              <AlarmClock className="h-4 w-4 mr-1" />
                              {reminder.taskType}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-medium">{reminder.dueDate}</div>
                            <Button size="sm" className="bg-green-800 hover:bg-green-700 text-green-300 mt-1">
                              Mark Done
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button className="w-full mt-2 bg-green-800 hover:bg-green-700 text-green-300">
                        Add New Reminder
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-green-500 mb-4">
                        You don't have any plant care reminders set up yet.
                      </p>
                      <Button className="bg-green-800 hover:bg-green-700 text-green-300">
                        Set Up Reminders
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center">
                    <Package className="mr-2 h-5 w-5 text-green-400" />
                    <CardTitle className="text-green-300">Your Orders</CardTitle>
                  </div>
                  <CardDescription className="text-green-500">
                    Track and manage your plant orders.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {mockOrders.length > 0 ? (
                    <div className="space-y-6">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="border border-green-900/30 rounded-lg overflow-hidden">
                          <div className="flex justify-between items-center p-4 bg-green-900/20">
                            <div>
                              <p className="text-green-300 font-medium">{order.id}</p>
                              <p className="text-green-500 text-sm">
                                <Calendar className="inline h-4 w-4 mr-1" />
                                {order.date}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-green-300 font-medium">${order.total.toFixed(2)}</p>
                              <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                                order.status === "Delivered" 
                                  ? "bg-green-900/50 text-green-300" 
                                  : "bg-yellow-900/50 text-yellow-300"
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="p-4 bg-green-900/10">
                            <h4 className="text-green-300 text-sm font-medium mb-2">Items</h4>
                            <ul className="space-y-1">
                              {order.items.map((item, index) => (
                                <li key={index} className="flex justify-between text-sm">
                                  <span className="text-green-400">
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span className="text-green-400">${item.price.toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex justify-between mt-4">
                              <Button 
                                size="sm"
                                variant="outline"
                                className="bg-transparent border-green-800 text-green-400 hover:bg-green-900/20 hover:text-green-300"
                              >
                                Order Details
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-green-800 hover:bg-green-700 text-green-300"
                                onClick={() => setActiveTab("tracking")}
                              >
                                Track Order
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-green-500 mb-4">
                        You haven't placed any orders yet.
                      </p>
                      <Link to="/shop">
                        <Button className="bg-green-800 hover:bg-green-700 text-green-300">
                          Start Shopping
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracking">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center">
                    <Truck className="mr-2 h-5 w-5 text-green-400" />
                    <CardTitle className="text-green-300">Order Tracking</CardTitle>
                  </div>
                  <CardDescription className="text-green-500">
                    Track the status of your plant deliveries.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {mockOrders.length > 0 ? (
                    <div>
                      <div className="mb-6">
                        <h3 className="text-green-300 font-medium mb-2">Enter Tracking Number</h3>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Tracking number" 
                            className="bg-black/40 border-green-900/50 text-green-300 placeholder:text-green-700"
                          />
                          <Button className="bg-green-800 hover:bg-green-700 text-green-300">
                            Track
                          </Button>
                        </div>
                      </div>
                      
                      <h3 className="text-green-300 font-medium mb-4">Recent Order Status</h3>
                      <div className="space-y-6">
                        {mockOrders.map((order) => (
                          <div key={order.id} className="border border-green-900/30 rounded-lg overflow-hidden">
                            <div className="p-4 bg-green-900/20">
                              <div className="flex justify-between">
                                <p className="text-green-300 font-medium">{order.id}</p>
                                <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                                  order.status === "Delivered" 
                                    ? "bg-green-900/50 text-green-300" 
                                    : "bg-yellow-900/50 text-yellow-300"
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-green-500 text-sm">Ordered on {order.date}</p>
                            </div>
                            
                            {order.status === "Processing" ? (
                              <div className="p-4 bg-green-900/10">
                                <ul className="relative border-l border-green-800 ml-3">
                                  <li className="mb-6 ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-800 rounded-full -left-3">
                                      <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                      </svg>
                                    </span>
                                    <h3 className="text-green-300">Order Received</h3>
                                    <p className="text-green-500 text-sm">May 15, 2025 - 10:24 AM</p>
                                  </li>
                                  <li className="mb-6 ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-800 rounded-full -left-3">
                                      <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                      </svg>
                                    </span>
                                    <h3 className="text-green-300">Processing</h3>
                                    <p className="text-green-500 text-sm">May 15, 2025 - 11:30 AM</p>
                                  </li>
                                  <li className="ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-900/40 border border-green-800 rounded-full -left-3">
                                      <span className="w-2 h-2 bg-green-900/60 rounded-full"></span>
                                    </span>
                                    <h3 className="text-green-500">Shipping</h3>
                                    <p className="text-green-600 text-sm">Awaiting shipment</p>
                                  </li>
                                </ul>
                              </div>
                            ) : (
                              <div className="p-4 bg-green-900/10">
                                <ul className="relative border-l border-green-800 ml-3">
                                  <li className="mb-6 ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-800 rounded-full -left-3">
                                      <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                      </svg>
                                    </span>
                                    <h3 className="text-green-300">Order Received</h3>
                                    <p className="text-green-500 text-sm">May 10, 2025 - 9:15 AM</p>
                                  </li>
                                  <li className="mb-6 ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-800 rounded-full -left-3">
                                      <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                      </svg>
                                    </span>
                                    <h3 className="text-green-300">Processing</h3>
                                    <p className="text-green-500 text-sm">May 10, 2025 - 11:30 AM</p>
                                  </li>
                                  <li className="mb-6 ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-800 rounded-full -left-3">
                                      <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                      </svg>
                                    </span>
                                    <h3 className="text-green-300">Shipped</h3>
                                    <p className="text-green-500 text-sm">May 11, 2025 - 2:00 PM</p>
                                    <p className="text-green-400 text-xs mt-1">Tracking: TRK123456789</p>
                                  </li>
                                  <li className="ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-800 rounded-full -left-3">
                                      <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                      </svg>
                                    </span>
                                    <h3 className="text-green-300">Delivered</h3>
                                    <p className="text-green-500 text-sm">May 13, 2025 - 10:45 AM</p>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-green-500 mb-4">
                        No orders to track.
                      </p>
                      <Link to="/shop">
                        <Button className="bg-green-800 hover:bg-green-700 text-green-300">
                          Shop Now
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="returns">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center">
                    <RotateCcw className="mr-2 h-5 w-5 text-green-400" />
                    <CardTitle className="text-green-300">Returns & Refunds</CardTitle>
                  </div>
                  <CardDescription className="text-green-500">
                    Manage your plant returns and refunds.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="glass-effect rounded-lg p-6">
                      <h3 className="text-green-300 font-medium mb-4">Return Policy</h3>
                      <div className="text-green-400 space-y-4">
                        <p>
                          At Natural Green Nursery, we want you to be completely satisfied with your purchase.
                          If you're not happy with your plants, we offer a 30-day guarantee.
                        </p>
                        <h4 className="text-green-300 font-medium">Eligible Products</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Plants that arrive damaged</li>
                          <li>Plants that die within 30 days (with proper care)</li>
                          <li>Accessories that arrive damaged or defective</li>
                        </ul>
                        <h4 className="text-green-300 font-medium">How to Return</h4>
                        <p>
                          To initiate a return, please contact our customer service team with your order number
                          and photos of the affected plants.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-green-300 font-medium mb-4">Initiate a Return</h3>
                      <form className="space-y-4">
                        <div>
                          <label className="text-green-400 block mb-1">Order Number</label>
                          <Input 
                            placeholder="e.g. ORD-12345" 
                            className="bg-black/40 border-green-900/50 text-green-300 placeholder:text-green-700"
                          />
                        </div>
                        <div>
                          <label className="text-green-400 block mb-1">Return Reason</label>
                          <select className="w-full rounded-md bg-black/40 border-green-900/50 text-green-300 focus:border-green-500 focus:ring-green-500">
                            <option>Please select a reason</option>
                            <option>Plant arrived damaged</option>
                            <option>Plant died within 30 days</option>
                            <option>Received incorrect item</option>
                            <option>Other (please specify)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-green-400 block mb-1">Additional Information</label>
                          <textarea 
                            rows={3} 
                            className="w-full rounded-md bg-black/40 border-green-900/50 text-green-300 focus:border-green-500 focus:ring-green-500"
                            placeholder="Please describe the issue..."
                          ></textarea>
                        </div>
                        <Button type="submit" className="bg-green-800 hover:bg-green-700 text-green-300">
                          Submit Return Request
                        </Button>
                      </form>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center">
                    <Heart className="mr-2 h-5 w-5 text-green-400" />
                    <CardTitle className="text-green-300">Your Wishlist</CardTitle>
                  </div>
                  <CardDescription className="text-green-500">
                    Plants you've saved for later.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {wishlistItems.length > 0 ? (
                    <div className="space-y-4">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-green-900/10 rounded-lg border border-green-900/20">
                          <div className="h-16 w-16 rounded-md overflow-hidden">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-green-300 font-medium">{item.name}</h4>
                            <p className="text-green-400">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button size="sm" className="bg-green-800 hover:bg-green-700 text-green-300">
                              Add to Cart
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-transparent border-red-900 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-green-500 mb-4">
                        Your wishlist is empty.
                      </p>
                      <Link to="/shop">
                        <Button className="bg-green-800 hover:bg-green-700 text-green-300">
                          Discover Plants
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-green-400" />
                    <CardTitle className="text-green-300">Account Settings</CardTitle>
                  </div>
                  <CardDescription className="text-green-500">
                    Manage your account details and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-green-300">Personal Information</h3>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <label className="text-green-400 block mb-1">Name</label>
                        <Input 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-black/40 border-green-900/50 text-green-300"
                        />
                      </div>
                      <div>
                        <label className="text-green-400 block mb-1">Email</label>
                        <Input 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-black/40 border-green-900/50 text-green-300"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="bg-green-800 hover:bg-green-700 text-green-300"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-green-300">Preferences</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-green-400">Email Notifications</span>
                        <Button 
                          variant="outline" 
                          className="h-8 bg-transparent border-green-800 text-green-400 hover:bg-green-900/20 hover:text-green-300"
                        >
                          Manage
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400">Password</span>
                        <Button 
                          variant="outline" 
                          className="h-8 bg-transparent border-green-800 text-green-400 hover:bg-green-900/20 hover:text-green-300"
                        >
                          Change
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400">Delete Account</span>
                        <Button 
                          variant="outline" 
                          className="h-8 bg-transparent border-red-900 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
