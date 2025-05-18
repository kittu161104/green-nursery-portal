
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SideNavAdmin from "@/components/admin/SideNavAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Phone, Info, ShoppingCart } from "lucide-react";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

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

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavAdmin />
      
      <div className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-green-300">Dashboard</h1>
            <p className="text-green-500">Welcome to your admin dashboard</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/40 shadow-lg border-green-900/30 backdrop-blur-md transition-all duration-300 hover:border-green-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-green-300">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-400">25</p>
                <p className="text-green-500 text-sm mt-1">3 low stock items</p>
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
                <p className="text-3xl font-bold text-green-400">18</p>
                <p className="text-green-500 text-sm mt-1">5 pending fulfillment</p>
                <Button
                  className="mt-4 bg-green-900 hover:bg-green-800 text-green-300 w-full"
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
                <p className="text-3xl font-bold text-green-400">$2,459.85</p>
                <p className="text-green-500 text-sm mt-1">This month</p>
                <Button
                  className="mt-4 bg-green-900 hover:bg-green-800 text-green-300 w-full"
                >
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>
          
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
                  <li className="p-4 flex items-center">
                    <div className="p-2 rounded-full bg-green-900/20 mr-4">
                      <ShoppingCart className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-green-300">New order <span className="font-medium">#12345</span></p>
                      <p className="text-green-500 text-sm">10 minutes ago</p>
                    </div>
                  </li>
                  <li className="p-4 flex items-center">
                    <div className="p-2 rounded-full bg-green-900/20 mr-4">
                      <Package className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-green-300">Product <span className="font-medium">Snake Plant</span> is low on stock</p>
                      <p className="text-green-500 text-sm">2 hours ago</p>
                    </div>
                  </li>
                  <li className="p-4 flex items-center">
                    <div className="p-2 rounded-full bg-green-900/20 mr-4">
                      <ShoppingCart className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-green-300">New order <span className="font-medium">#12344</span></p>
                      <p className="text-green-500 text-sm">Yesterday at 3:45 PM</p>
                    </div>
                  </li>
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
