
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
          
          <div className="p-4 rounded-lg bg-green-950/20 border border-green-900/40 backdrop-blur-sm">
            <h2 className="text-lg font-medium text-green-300 mb-2">Tips for writing great content:</h2>
            <ul className="list-disc list-inside text-green-400 space-y-2">
              <li>Keep your content concise and engaging</li>
              <li>Use descriptive language that evokes the beauty of plants</li>
              <li>Share your unique story in the history section</li>
              <li>Make your mission statement inspiring and memorable</li>
              <li>Ensure your vision communicates your long-term goals</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutAdmin;
