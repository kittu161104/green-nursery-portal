
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SideNavAdmin from "@/components/admin/SideNavAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Users, User as UserIcon, UserPlus, UserCheck, Mail, Phone, MapPin, Clock } from "lucide-react";

interface CustomerProfile {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  created_at: string;
  last_sign_in?: string;
  role?: "admin" | "customer";
  total_orders?: number;
  total_spent?: number;
}

const CustomersAdmin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        
        // Fetch all user profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          return;
        }
        
        // Fetch all user roles to determine admins
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('*');
          
        if (rolesError) {
          console.error("Error fetching roles:", rolesError);
        }
        
        // Fetch order data for each customer
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('user_id, total_amount');
          
        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
        }
        
        // Fetch auth data (requires admin privileges, may need edge function in production)
        const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error("Error fetching auth users:", authError);
        }
        
        // Process and combine data
        const customersData = profiles.map(profile => {
          // Find corresponding auth user
          const authUser = authUsers?.find(user => user.id === profile.id);
          
          // Find role
          const userRole = roles?.find(role => role.user_id === profile.id);
          
          // Calculate order stats
          const userOrders = orders?.filter(order => order.user_id === profile.id) || [];
          const totalOrders = userOrders.length;
          const totalSpent = userOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
          
          return {
            ...profile,
            email: authUser?.email,
            last_sign_in: authUser?.last_sign_in_at,
            role: userRole?.role || "customer",
            total_orders: totalOrders,
            total_spent: totalSpent
          };
        });
        
        setCustomers(customersData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchCustomers();
    }
  }, [currentUser]);

  const filteredCustomers = customers.filter(customer => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      customer.full_name.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search) ||
      customer.city?.toLowerCase().includes(search) ||
      customer.state?.toLowerCase().includes(search)
    );
  });
  
  // Stats calculation
  const totalCustomers = customers.length;
  const totalAdmins = customers.filter(c => c.role === "admin").length;
  const activeCustomers = customers.filter(c => c.total_orders && c.total_orders > 0).length;
  const newCustomersThisMonth = customers.filter(c => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return new Date(c.created_at) > oneMonthAgo;
  }).length;

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavAdmin />
      
      <div className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-green-300">Customer Management</h1>
            <p className="text-green-400">View and manage customer accounts</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-black/40 border-green-900/30 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-300 text-lg">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-500 mr-2" />
                  <span className="text-2xl font-bold text-green-300">{totalCustomers}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-green-900/30 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-300 text-lg">Active Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold text-green-300">{activeCustomers}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-green-900/30 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-300 text-lg">New This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <UserPlus className="h-8 w-8 text-yellow-500 mr-2" />
                  <span className="text-2xl font-bold text-green-300">{newCustomersThisMonth}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-green-900/30 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-300 text-lg">Admin Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <UserIcon className="h-8 w-8 text-purple-500 mr-2" />
                  <span className="text-2xl font-bold text-green-300">{totalAdmins}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Customers Table */}
          <Card className="bg-black/40 border-green-900/30 shadow-md">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-green-300">Customer List</CardTitle>
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm bg-black/40 border-green-900/50 text-green-300"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-green-400">Loading customers...</p>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-green-900/50" />
                  <h3 className="mt-2 text-lg font-medium text-green-300">No customers found</h3>
                  <p className="mt-1 text-green-400">
                    {searchTerm 
                      ? "Try adjusting your search term" 
                      : "You don't have any registered customers yet"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-green-900/30">
                        <th className="text-left py-3 px-4 text-green-400 font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-green-400 font-medium">Contact</th>
                        <th className="text-left py-3 px-4 text-green-400 font-medium">Location</th>
                        <th className="text-left py-3 px-4 text-green-400 font-medium">Joined</th>
                        <th className="text-left py-3 px-4 text-green-400 font-medium">Orders</th>
                        <th className="text-left py-3 px-4 text-green-400 font-medium">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b border-green-900/20 hover:bg-green-900/10">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-green-800/40 flex items-center justify-center mr-3">
                                <span className="text-green-300 font-medium">
                                  {customer.full_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="text-green-300 font-medium">{customer.full_name}</div>
                                <div className="text-green-400 text-sm">{customer.id.substring(0, 8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center text-green-300 mb-1">
                              <Mail className="h-4 w-4 mr-2 text-green-400" />
                              {customer.email || "N/A"}
                            </div>
                            <div className="flex items-center text-green-300">
                              <Phone className="h-4 w-4 mr-2 text-green-400" />
                              {customer.phone || "N/A"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center text-green-300">
                              <MapPin className="h-4 w-4 mr-2 text-green-400" />
                              {customer.city && customer.state 
                                ? `${customer.city}, ${customer.state}`
                                : customer.city || customer.state || "N/A"}
                            </div>
                            <div className="text-green-400 text-sm">
                              {customer.country || "India"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center text-green-300">
                              <Clock className="h-4 w-4 mr-2 text-green-400" />
                              {new Date(customer.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-green-400 text-sm">
                              {customer.last_sign_in 
                                ? `Last active: ${new Date(customer.last_sign_in).toLocaleDateString()}`
                                : "Never signed in"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-green-300">{customer.total_orders || 0} orders</div>
                            <div className="text-green-400 text-sm">
                              {customer.total_spent 
                                ? `₹${customer.total_spent.toLocaleString('en-IN')} spent`
                                : "₹0 spent"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {customer.role === "admin" ? (
                              <Badge className="bg-purple-900/50 text-purple-300 hover:bg-purple-900/70">Admin</Badge>
                            ) : (
                              <Badge className="bg-green-900/50 text-green-300 hover:bg-green-900/70">Customer</Badge>
                            )}
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

export default CustomersAdmin;
