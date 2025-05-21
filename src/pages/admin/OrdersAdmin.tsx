
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SideNavAdmin from "@/components/admin/SideNavAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Truck } from "lucide-react";
import { toast } from "sonner";

const OrdersAdmin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/signin");
    } else {
      // Simulate loading data
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [currentUser, navigate]);

  // Mock orders data
  const mockOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      date: "2023-04-15",
      status: "delivered",
      total: "$125.99",
      items: 3
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      date: "2023-04-14",
      status: "shipped",
      total: "$79.50",
      items: 2
    },
    {
      id: "ORD-003",
      customer: "Robert Johnson",
      date: "2023-04-13",
      status: "processing",
      total: "$210.25",
      items: 5
    },
    {
      id: "ORD-004",
      customer: "Emily Brown",
      date: "2023-04-12",
      status: "pending",
      total: "$45.00",
      items: 1
    }
  ];

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

  const handleUpdateStatus = (orderId: string, status: string) => {
    toast.success(`Order ${orderId} status updated to ${status}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-600">Delivered</Badge>;
      case "shipped":
        return <Badge className="bg-blue-600">Shipped</Badge>;
      case "processing":
        return <Badge className="bg-yellow-600">Processing</Badge>;
      case "pending":
        return <Badge className="bg-gray-500">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-600">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavAdmin />
      
      <div className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-green-300">Orders</h1>
            <p className="text-green-500">Manage customer orders and track shipments</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-grow max-w-md">
              <Input 
                placeholder="Search orders..."
                className="bg-black/40 border-green-900/50 text-green-300"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="bg-black/40 border-green-900/50 text-green-300 w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-green-900/50 text-green-300">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Card className="bg-black/40 border-green-900/30">
            <CardHeader>
              <CardTitle className="text-green-300">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-green-900/20 rounded"></div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-green-900/30">
                      <TableHead className="text-green-400">Order ID</TableHead>
                      <TableHead className="text-green-400">Customer</TableHead>
                      <TableHead className="text-green-400">Date</TableHead>
                      <TableHead className="text-green-400">Status</TableHead>
                      <TableHead className="text-green-400">Items</TableHead>
                      <TableHead className="text-green-400">Total</TableHead>
                      <TableHead className="text-green-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => (
                      <TableRow key={order.id} className="border-green-900/30 hover:bg-green-900/10">
                        <TableCell className="text-green-300 font-medium">{order.id}</TableCell>
                        <TableCell className="text-green-300">{order.customer}</TableCell>
                        <TableCell className="text-green-300">{order.date}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-green-300">{order.items}</TableCell>
                        <TableCell className="text-green-300">{order.total}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              defaultValue={order.status}
                              onValueChange={(value) => handleUpdateStatus(order.id, value)}
                            >
                              <SelectTrigger className="h-8 w-32 bg-black/40 border-green-900/50 text-green-300">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-black/90 border-green-900/50 text-green-300">
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button variant="outline" size="sm" className="border-green-900/50 text-green-300 hover:bg-green-900/20">
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrdersAdmin;
