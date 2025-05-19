
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SideNavAdmin from "@/components/admin/SideNavAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Phone, Info, ShoppingCart, IndianRupee, TrendingUp, TrendingDown, Bell } from "lucide-react";

// Mock data for orders and revenue
const mockOrders = [
  { id: "ORD123", total: 1599, date: new Date(2025, 4, 15), status: "completed" },
  { id: "ORD124", total: 2799, date: new Date(2025, 4, 16), status: "completed" },
  { id: "ORD125", total: 899, date: new Date(2025, 4, 17), status: "processing" },
  { id: "ORD126", total: 3499, date: new Date(2025, 3, 18), status: "completed" },
  { id: "ORD127", total: 1299, date: new Date(2025, 2, 19), status: "completed" },
  { id: "ORD128", total: 2199, date: new Date(2025, 1, 20), status: "completed" },
  { id: "ORD129", total: 1799, date: new Date(2024, 11, 21), status: "completed" },
  { id: "ORD130", total: 999, date: new Date(2024, 10, 22), status: "cancelled" },
];

// Mock data for low stock products
const lowStockProducts = [
  { id: "1", name: "Snake Plant", stock: 3 },
  { id: "2", name: "Monstera Deliciosa", stock: 2 },
  { id: "3", name: "Fiddle Leaf Fig", stock: 0 },
];

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("this-week");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // Filter orders based on selected time period
    const now = new Date();
    const filtered = mockOrders.filter(order => {
      const orderDate = new Date(order.date);
      
      switch (timeFilter) {
        case "this-week":
          // Orders from the past 7 days
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return orderDate >= weekAgo;
        
        case "this-month":
          // Orders from the past 30 days
          const monthAgo = new Date(now);
          monthAgo.setDate(now.getDate() - 30);
          return orderDate >= monthAgo;
        
        case "last-6-months":
          // Orders from the past 6 months
          const sixMonthsAgo = new Date(now);
          sixMonthsAgo.setMonth(now.getMonth() - 6);
          return orderDate >= sixMonthsAgo;
        
        case "last-year":
          // Orders from the past year
          const yearAgo = new Date(now);
          yearAgo.setFullYear(now.getFullYear() - 1);
          return orderDate >= yearAgo;
        
        case "all-time":
          // All orders
          return true;
        
        default:
          return true;
      }
    });
    
    setFilteredOrders(filtered);

    // Generate recent activity
    const recentOrderActivity = mockOrders
      .filter(order => {
        const orderDate = new Date(order.date);
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return orderDate >= weekAgo;
      })
      .map(order => ({
        type: order.status === "cancelled" ? "cancellation" : "new-order",
        id: order.id,
        date: order.date,
        content: order.status === "cancelled" 
          ? `Order ${order.id} was cancelled`
          : `New order ${order.id} received`
      }));

    const stockActivity = lowStockProducts.map(product => ({
      type: "low-stock",
      id: product.id,
      date: new Date(2025, 4, 17), // Mock date
      content: `${product.name} is ${product.stock === 0 ? 'out of stock' : 'low on stock'} (${product.stock} left)`
    }));

    const combinedActivity = [...recentOrderActivity, ...stockActivity]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

    setRecentActivity(combinedActivity);
  }, [timeFilter]);

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

  // Calculate metrics based on filtered orders
  const completedOrders = filteredOrders.filter(order => order.status === "completed");
  const pendingOrders = filteredOrders.filter(order => order.status === "processing");
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const orderCount = filteredOrders.length;

  // Determine revenue trend (simplified)
  const revenueTrend = totalRevenue > 10000 ? "up" : "down";

  const adminCards = [
    {
      title: "Manage Products",
      description: "Add, edit, or remove products from your store",
      icon: <Package className="h-8 w-8 text-green-400" />,
      path: "/admin/products"
    },
    {
      title: "About Page",
      description: "Update the about page content and company information",
      icon: <Info className="h-8 w-8 text-green-400" />,
      path: "/admin/about"
    },
    {
      title: "Contact Information",
      description: "Edit the contact details displayed on your website",
      icon: <Phone className="h-8 w-8 text-green-400" />,
      path: "/admin/contact"
    }
  ];

  const formatDate = (date) => {
    const today = new Date();
    const orderDate = new Date(date);
    
    // Check if the date is today
    if (orderDate.toDateString() === today.toDateString()) {
      const hours = orderDate.getHours();
      const minutes = orderDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `Today at ${formattedHours}:${formattedMinutes} ${ampm}`;
    }
    
    // Check if the date was yesterday
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (orderDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    // Format date as MM/DD/YYYY
    return orderDate.toLocaleDateString("en-IN");
  };

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavAdmin />
      
      <div className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-green-300">Dashboard</h1>
            <p className="text-green-500">Welcome to your admin dashboard</p>
          </div>
          
          <Tabs defaultValue="this-week" onValueChange={setTimeFilter}>
            <TabsList className="mb-6">
              <TabsTrigger value="this-week">This Week</TabsTrigger>
              <TabsTrigger value="this-month">This Month</TabsTrigger>
              <TabsTrigger value="last-6-months">Last 6 Months</TabsTrigger>
              <TabsTrigger value="last-year">Last Year</TabsTrigger>
              <TabsTrigger value="all-time">All Time</TabsTrigger>
            </TabsList>
          
            <TabsContent value={timeFilter} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-black/40 shadow-lg border-green-900/30 backdrop-blur-md transition-all duration-300 hover:border-green-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-green-300">Total Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-400">25</p>
                    <p className="text-green-500 text-sm mt-1">{lowStockProducts.length} low stock items</p>
                    <Button
                      className="mt-4 bg-green-900 hover:bg-green-800 text-green-300 w-full"
                      onClick={() => navigate("/admin/products")}
                    >
                      Manage Products
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/40 shadow-lg border-green-900/30 backdrop-blur-md transition-all duration-300 hover:border-green-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-green-300">Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-400">{orderCount}</p>
                    <p className="text-green-500 text-sm mt-1">{pendingOrders.length} pending fulfillment</p>
                    <Button
                      className="mt-4 bg-green-900 hover:bg-green-800 text-green-300 w-full"
                      onClick={() => navigate("/admin/orders")}
                    >
                      View Orders
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/40 shadow-lg border-green-900/30 backdrop-blur-md transition-all duration-300 hover:border-green-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-green-300">Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-6 w-6 text-green-400" />
                      <p className="text-3xl font-bold text-green-400">{totalRevenue.toLocaleString('en-IN')}</p>
                      {revenueTrend === "up" ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-green-500 text-sm mt-1">
                      {timeFilter === "this-week" ? "This week" : 
                       timeFilter === "this-month" ? "This month" :
                       timeFilter === "last-6-months" ? "Last 6 months" :
                       timeFilter === "last-year" ? "Last year" : "All time"}
                    </p>
                    <Button
                      className="mt-4 bg-green-900 hover:bg-green-800 text-green-300 w-full"
                      onClick={() => navigate("/admin/reports")}
                    >
                      View Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <h2 className="text-xl font-bold text-green-300 mt-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adminCards.map((card, index) => (
              <Link to={card.path} key={index} className="block group">
                <Card className="h-full bg-black/40 shadow-lg border-green-900/30 backdrop-blur-md transition-all duration-300 group-hover:border-green-700/50">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <div className="p-3 rounded-full bg-green-900/20 border border-green-900/30 mb-4 group-hover:bg-green-900/30 transition-all">
                      {card.icon}
                    </div>
                    <h3 className="text-lg font-bold text-green-300 mb-2">{card.title}</h3>
                    <p className="text-green-500">{card.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-bold text-green-300 mb-4">Recent Activity</h2>
            <Card className="bg-black/40 shadow-lg border-green-900/30 backdrop-blur-md">
              <CardContent className="p-0">
                <ul className="divide-y divide-green-900/30">
                  {recentActivity.map((activity, index) => (
                    <li key={index} className="p-4 flex items-center">
                      <div className="p-2 rounded-full bg-green-900/20 mr-4">
                        {activity.type === "new-order" ? (
                          <ShoppingCart className="h-5 w-5 text-green-400" />
                        ) : activity.type === "cancellation" ? (
                          <ShoppingCart className="h-5 w-5 text-red-400" />
                        ) : (
                          <Package className="h-5 w-5 text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <p className={`${activity.type === "cancellation" ? "text-red-300" : "text-green-300"}`}>
                          {activity.content}
                        </p>
                        <p className="text-green-500 text-sm">{formatDate(activity.date)}</p>
                      </div>
                    </li>
                  ))}
                  
                  {recentActivity.length === 0 && (
                    <li className="p-4 text-center text-green-500">
                      No recent activity to display
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
