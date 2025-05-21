
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SideNavAdmin from "@/components/admin/SideNavAdmin";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  TruckDelivery,
  RefreshCw,
  Search,
  PackageCheck,
  PackageX,
  Clock,
} from "lucide-react";

// Sample order data
const sampleOrders = [
  {
    id: "ord-001",
    customer: "John Doe",
    email: "john@example.com",
    orderDate: "2025-05-15T14:30:00",
    status: "processing",
    total: 2499,
    items: [
      { name: "Monstera Deliciosa", price: 1299, quantity: 1 },
      { name: "Terracotta Pot - Medium", price: 599, quantity: 2 }
    ]
  },
  {
    id: "ord-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    orderDate: "2025-05-14T10:15:00",
    status: "delivered",
    total: 3799,
    items: [
      { name: "Fiddle Leaf Fig", price: 1999, quantity: 1 },
      { name: "Premium Potting Soil", price: 899, quantity: 2 }
    ]
  },
  {
    id: "ord-003",
    customer: "Robert Johnson",
    email: "robert@example.com",
    orderDate: "2025-05-13T16:45:00",
    status: "returned",
    returnReason: "Plant arrived damaged",
    total: 1799,
    items: [
      { name: "Snake Plant", price: 899, quantity: 2 }
    ]
  },
  {
    id: "ord-004",
    customer: "Maria Garcia",
    email: "maria@example.com",
    orderDate: "2025-05-12T09:20:00",
    status: "delivered",
    total: 4299,
    items: [
      { name: "Bird of Paradise", price: 2499, quantity: 1 },
      { name: "Ceramic Pot - Large", price: 1800, quantity: 1 }
    ]
  },
  {
    id: "ord-005",
    customer: "David Wilson",
    email: "david@example.com",
    orderDate: "2025-05-11T11:10:00",
    status: "processing",
    total: 3599,
    items: [
      { name: "ZZ Plant", price: 1299, quantity: 1 },
      { name: "Plant Food", price: 499, quantity: 2 },
      { name: "Hanging Planter", price: 1499, quantity: 1 }
    ]
  },
  {
    id: "ord-006",
    customer: "Sarah Brown",
    email: "sarah@example.com",
    orderDate: "2025-05-10T15:30:00",
    status: "refunded",
    returnReason: "Changed mind",
    total: 2199,
    items: [
      { name: "Pothos", price: 899, quantity: 1 },
      { name: "Small Planter Set", price: 1300, quantity: 1 }
    ]
  }
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let color = "";
  let icon = null;
  
  switch (status) {
    case "processing":
      color = "bg-blue-500/20 text-blue-300 border-blue-500/30";
      icon = <Clock className="w-4 h-4 mr-1" />;
      break;
    case "delivered":
      color = "bg-green-500/20 text-green-300 border-green-500/30";
      icon = <PackageCheck className="w-4 h-4 mr-1" />;
      break;
    case "returned":
      color = "bg-amber-500/20 text-amber-300 border-amber-500/30";
      icon = <RefreshCw className="w-4 h-4 mr-1" />;
      break;
    case "refunded":
      color = "bg-red-500/20 text-red-300 border-red-500/30";
      icon = <PackageX className="w-4 h-4 mr-1" />;
      break;
    default:
      color = "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
  
  return (
    <Badge className={`${color} flex items-center justify-center gap-1`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const OrdersAdmin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  // Filter orders based on active tab, search term, and status filter
  const filteredOrders = sampleOrders.filter(order => {
    // Tab filter
    if (activeTab !== "all" && order.status !== activeTab) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    
    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.toLowerCase().includes(searchLower) ||
        order.email.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Order statistics
  const orderStats = {
    total: sampleOrders.length,
    processing: sampleOrders.filter(o => o.status === "processing").length,
    delivered: sampleOrders.filter(o => o.status === "delivered").length,
    returned: sampleOrders.filter(o => o.status === "returned").length + 
              sampleOrders.filter(o => o.status === "refunded").length,
    revenue: sampleOrders.reduce((sum, order) => 
      order.status !== "refunded" ? sum + order.total : sum, 0)
  };

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return "₹" + (amount / 100).toFixed(2);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavAdmin />
      
      <div className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-green-300">Orders</h1>
            <p className="text-green-500">Manage customer orders</p>
          </div>
          
          {/* Order Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-black/40 border-green-900/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-500 text-sm">Total Orders</p>
                    <h3 className="text-green-300 text-2xl font-bold">{orderStats.total}</h3>
                  </div>
                  <Package className="text-green-400 h-8 w-8" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-green-900/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-500 text-sm">Processing</p>
                    <h3 className="text-green-300 text-2xl font-bold">{orderStats.processing}</h3>
                  </div>
                  <Clock className="text-blue-400 h-8 w-8" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-green-900/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-500 text-sm">Delivered</p>
                    <h3 className="text-green-300 text-2xl font-bold">{orderStats.delivered}</h3>
                  </div>
                  <TruckDelivery className="text-green-400 h-8 w-8" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-green-900/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-500 text-sm">Returns/Refunds</p>
                    <h3 className="text-green-300 text-2xl font-bold">{orderStats.returned}</h3>
                  </div>
                  <RefreshCw className="text-amber-400 h-8 w-8" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-green-900/30 col-span-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-500 text-sm">Total Revenue</p>
                    <h3 className="text-green-300 text-3xl font-bold">{formatCurrency(orderStats.revenue)}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
              <Input 
                placeholder="Search orders by ID or customer..." 
                className="pl-10 bg-black/40 border-green-900/50 text-green-300 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-black/40 border-green-900/50 text-green-300">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-md border-green-900/50">
                <SelectItem value="all" className="text-green-300">All Statuses</SelectItem>
                <SelectItem value="processing" className="text-blue-300">Processing</SelectItem>
                <SelectItem value="delivered" className="text-green-300">Delivered</SelectItem>
                <SelectItem value="returned" className="text-amber-300">Returned</SelectItem>
                <SelectItem value="refunded" className="text-red-300">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Orders List */}
          <Card className="bg-black/40 border-green-900/30">
            <CardHeader className="pb-2">
              <Tabs 
                defaultValue={activeTab} 
                className="w-full" 
                onValueChange={setActiveTab}
              >
                <TabsList className="grid grid-cols-4 bg-green-900/20">
                  <TabsTrigger value="all" className="data-[state=active]:bg-green-800 text-green-300">
                    All Orders
                  </TabsTrigger>
                  <TabsTrigger value="processing" className="data-[state=active]:bg-green-800 text-green-300">
                    Processing
                  </TabsTrigger>
                  <TabsTrigger value="delivered" className="data-[state=active]:bg-green-800 text-green-300">
                    Delivered
                  </TabsTrigger>
                  <TabsTrigger value="returned" className="data-[state=active]:bg-green-800 text-green-300">
                    Returns/Refunds
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="pt-6">
              {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="bg-black/60 border-green-900/20 overflow-hidden">
                      <div className="p-4">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-lg font-medium text-green-300">Order #{order.id}</h4>
                              <StatusBadge status={order.status} />
                            </div>
                            <p className="text-green-500 text-sm">{formatDate(order.orderDate)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-green-500">{order.customer}</p>
                            <p className="text-xs text-green-600">{order.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-green-400 text-sm">
                              <span>{item.name} × {item.quantity}</span>
                              <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        
                        {order.returnReason && (
                          <div className="mt-2 text-amber-300 text-sm">
                            <strong>Return reason:</strong> {order.returnReason}
                          </div>
                        )}
                        
                        <div className="mt-4 pt-2 border-t border-green-900/30 flex justify-between items-center">
                          <div className="font-medium text-green-300">
                            Total: {formatCurrency(order.total)}
                          </div>
                          <Button variant="outline" size="sm" className="border-green-800 text-green-400 hover:bg-green-900/20">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-green-400">No orders found matching your filters.</p>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="border-t border-green-900/30 pt-4">
              <div className="w-full text-center text-green-500 text-sm">
                Showing {filteredOrders.length} of {sampleOrders.length} orders
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrdersAdmin;
