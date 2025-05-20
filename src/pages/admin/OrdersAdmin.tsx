
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SideNavAdmin from "@/components/admin/SideNavAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Box, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  user_id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  total_amount: number;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  payment_method: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
}

const OrdersAdmin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Fetch orders with customer details
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            profiles:user_id (
              full_name,
              id
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching orders:", error);
          return;
        }
        
        // Format orders with customer info
        const formattedOrders = await Promise.all(data.map(async (order) => {
          // Fetch customer email from auth.users via profiles join
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
            order.profiles?.id
          );
          
          return {
            ...order,
            customer_name: order.profiles?.full_name || "Unknown",
            customer_email: userData?.user?.email || "Unknown"
          };
        }));
        
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function
    if (currentUser?.isAdmin) {
      fetchOrders();
    }
  }, [currentUser]);

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
      case "processing":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline" className="border-indigo-500 text-indigo-500">Shipped</Badge>;
      case "delivered":
        return <Badge variant="outline" className="border-green-500 text-green-500">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="border-red-500 text-red-500">Cancelled</Badge>;
      case "returned":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Returned</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: Order["payment_status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
      case "paid":
        return <Badge variant="outline" className="border-green-500 text-green-500">Paid</Badge>;
      case "failed":
        return <Badge variant="outline" className="border-red-500 text-red-500">Failed</Badge>;
      case "refunded":
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Refunded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      
      if (error) {
        console.error("Error updating order status:", error);
        return;
      }
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (filter !== "all" && order.status !== filter) {
      return false;
    }
    
    // Filter by search term (order ID or customer name/email)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(search) ||
        order.customer_name?.toLowerCase().includes(search) ||
        order.customer_email?.toLowerCase().includes(search) ||
        order.shipping_city.toLowerCase().includes(search) ||
        order.shipping_state.toLowerCase().includes(search)
      );
    }
    
    return true;
  });

  // Calculate counts for dashboard
  const pendingCount = orders.filter(order => order.status === "pending").length;
  const processingCount = orders.filter(order => order.status === "processing").length;
  const shippedCount = orders.filter(order => order.status === "shipped").length;
  const deliveredCount = orders.filter(order => order.status === "delivered").length;
  const cancelledCount = orders.filter(order => order.status === "cancelled").length;
  const returnedCount = orders.filter(order => order.status === "returned").length;

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavAdmin />
      
      <div className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-green-300">Orders Management</h1>
            <p className="text-green-400">View and manage customer orders</p>
          </div>
          
          {/* Order Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-black/40 border-green-900/30 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-300 text-lg">Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-500 mr-2" />
                    <span className="text-2xl font-bold text-green-300">{pendingCount + processingCount}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-green-900/50 text-green-300 hover:bg-green-900/20"
                    onClick={() => setFilter("pending")}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-green-900/30 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-300 text-lg">Delivered Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                    <span className="text-2xl font-bold text-green-300">{deliveredCount}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-green-900/50 text-green-300 hover:bg-green-900/20"
                    onClick={() => setFilter("delivered")}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-green-900/30 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-300 text-lg">Returned/Cancelled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <XCircle className="h-8 w-8 text-red-500 mr-2" />
                    <span className="text-2xl font-bold text-green-300">{cancelledCount + returnedCount}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-green-900/50 text-green-300 hover:bg-green-900/20"
                    onClick={() => setFilter("cancelled")}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Orders Table */}
          <Card className="bg-black/40 border-green-900/30 shadow-md">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-green-300">Order List</CardTitle>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-black/40 border-green-900/50 text-green-300"
                  />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="bg-black/40 border-green-900/50 text-green-300 w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-green-900/50 text-green-300">
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-green-400">Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Box className="mx-auto h-12 w-12 text-green-900/50" />
                  <h3 className="mt-2 text-lg font-medium text-green-300">No orders found</h3>
                  <p className="mt-1 text-green-400">
                    {searchTerm || filter !== "all" 
                      ? "Try changing your search or filter settings" 
                      : "You don't have any orders yet"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-green-900/30">
                        <th className="text-left py-3 px-4 text-green-400 font-medium">Order ID</th>
                        <th className="text-left py-3 px-4 text-green-400 font-medium">Customer</th>
                        <th className="text-left py-3 px-4 text-green-400 font-medium">Date</th>
                        <th className="text-left py-3 px-4 text-green-400 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 text-green-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-green-400 font-medium">Payment</th>
                        <th className="text-left py-3 px-4 text-green-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-green-900/20 hover:bg-green-900/10">
                          <td className="py-3 px-4 text-green-300">#{order.id.substring(0, 8)}</td>
                          <td className="py-3 px-4">
                            <div className="text-green-300">{order.customer_name}</div>
                            <div className="text-green-400 text-sm">{order.customer_email}</div>
                          </td>
                          <td className="py-3 px-4 text-green-300">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-green-300">₹{order.total_amount.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                          <td className="py-3 px-4">{getPaymentStatusBadge(order.payment_status)}</td>
                          <td className="py-3 px-4">
                            <Select 
                              value={order.status} 
                              onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                            >
                              <SelectTrigger className="bg-black/40 border-green-900/50 text-green-300 w-[140px]">
                                <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent className="bg-black border-green-900/50 text-green-300">
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="returned">Returned</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrdersAdmin;
