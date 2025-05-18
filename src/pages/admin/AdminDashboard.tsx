
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SideNavAdmin from "@/components/admin/SideNavAdmin";
import ContactInfoEditor from "@/components/admin/ContactInfoEditor";

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

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavAdmin />
      
      <div className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-green-300">Dashboard</h1>
            <p className="text-green-500">Welcome to your admin dashboard</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-black/40 rounded-xl p-6 border border-green-900/30 shadow-lg backdrop-blur-md">
                <h2 className="text-xl font-semibold mb-2 text-green-300">Quick Overview</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-black/30 p-4 rounded-lg border border-green-900/20">
                    <div className="text-sm text-green-500">Total Products</div>
                    <div className="text-2xl font-bold text-green-300">25</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg border border-green-900/20">
                    <div className="text-sm text-green-500">Low Stock Items</div>
                    <div className="text-2xl font-bold text-green-300">3</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg border border-green-900/20">
                    <div className="text-sm text-green-500">Total Orders</div>
                    <div className="text-2xl font-bold text-green-300">18</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg border border-green-900/20">
                    <div className="text-sm text-green-500">Pending Orders</div>
                    <div className="text-2xl font-bold text-green-300">5</div>
                  </div>
                </div>
              </div>
            </div>
            
            <ContactInfoEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
