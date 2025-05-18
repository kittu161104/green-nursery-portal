
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SideNavAdmin from "@/components/admin/SideNavAdmin";
import AboutInfoEditor from "@/components/admin/AboutInfoEditor";

const AboutAdmin = () => {
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
            <h1 className="text-3xl font-bold text-green-300">About Page Management</h1>
            <p className="text-green-500">Manage content for the About page</p>
          </div>
          
          <AboutInfoEditor />
        </div>
      </div>
    </div>
  );
};

export default AboutAdmin;
