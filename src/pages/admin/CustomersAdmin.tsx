
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SideNavAdmin from "@/components/admin/SideNavAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Mail, Calendar, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Customer {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  full_name: string | null;
}

const CustomersAdmin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
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
        // Retrieve users from Supabase auth.users
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
        
        if (userError) {
          console.error("Error fetching users:", userError);
          return;
        }
        
        // Format the data
        const formattedCustomers = userData.users.map(user => ({
          id: user.id,
          email: user.email || '',
          created_at: user.created_at || '',
          last_sign_in_at: user.last_sign_in_at || null,
          full_name: user.user_metadata?.full_name || null
        }));
        
        setCustomers(formattedCustomers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchCustomers();
    }
  }, [currentUser]);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.full_name && customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString('en-US', {
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
            <h1 className="text-3xl font-bold text-green-300">Customers</h1>
            <p className="text-green-500">Manage and view customer information</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
            <Input 
              placeholder="Search customers by name or email..." 
              className="pl-10 bg-black/40 border-green-900/50 text-green-300 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Card className="bg-black/40 border-green-900/30">
            <CardHeader>
              <CardTitle className="text-green-300">Customer List</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-green-900/20 rounded"></div>
                  ))}
                </div>
              ) : filteredCustomers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-green-900/30">
                        <TableHead className="text-green-400">Customer</TableHead>
                        <TableHead className="text-green-400">Email</TableHead>
                        <TableHead className="text-green-400">Registered</TableHead>
                        <TableHead className="text-green-400">Last Sign In</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((customer) => (
                        <TableRow 
                          key={customer.id} 
                          className="border-green-900/30 hover:bg-green-900/10"
                        >
                          <TableCell className="text-green-300">
                            <div className="flex items-center gap-2">
                              <User className="w-5 h-5 text-green-500" />
                              {customer.full_name || "Unknown"}
                            </div>
                          </TableCell>
                          <TableCell className="text-green-300">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-green-500" />
                              {customer.email}
                            </div>
                          </TableCell>
                          <TableCell className="text-green-300">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-green-500" />
                              {formatDate(customer.created_at)}
                            </div>
                          </TableCell>
                          <TableCell className="text-green-300">
                            {formatDate(customer.last_sign_in_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-8 text-green-400">
                  No customers found matching your search criteria.
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
