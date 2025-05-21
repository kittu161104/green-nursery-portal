
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Lock } from "lucide-react";

const AdminCodeSettings = () => {
  const [currentAdminCode, setCurrentAdminCode] = useState("");
  const [newAdminCode, setNewAdminCode] = useState("");
  const [confirmNewAdminCode, setConfirmNewAdminCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateAdminCode } = useAuth();

  const handleUpdateAdminCode = async () => {
    if (!currentAdminCode || !newAdminCode) {
      toast.error("All fields are required");
      return;
    }

    if (newAdminCode !== confirmNewAdminCode) {
      toast.error("New admin codes do not match");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await updateAdminCode(currentAdminCode, newAdminCode);
      
      if (success) {
        setCurrentAdminCode("");
        setNewAdminCode("");
        setConfirmNewAdminCode("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-black/40 border-green-900/30">
      <CardHeader>
        <CardTitle className="text-green-300 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Admin Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="current-code" className="text-green-300">Current Admin Code</Label>
          <Input
            id="current-code"
            type="password"
            value={currentAdminCode}
            onChange={(e) => setCurrentAdminCode(e.target.value)}
            className="bg-black/40 border-green-900/50 text-green-300"
            placeholder="Enter current admin code"
          />
          <p className="text-xs text-green-500">
            Note: Use "Natural.green.nursery" if this is your first time changing the code.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="new-code" className="text-green-300">New Admin Code</Label>
          <Input
            id="new-code"
            type="password"
            value={newAdminCode}
            onChange={(e) => setNewAdminCode(e.target.value)}
            className="bg-black/40 border-green-900/50 text-green-300"
            placeholder="Enter new admin code"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirm-new-code" className="text-green-300">Confirm New Admin Code</Label>
          <Input
            id="confirm-new-code"
            type="password"
            value={confirmNewAdminCode}
            onChange={(e) => setConfirmNewAdminCode(e.target.value)}
            className="bg-black/40 border-green-900/50 text-green-300"
            placeholder="Confirm new admin code"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpdateAdminCode}
          className="bg-green-800 hover:bg-green-700 text-green-300"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Admin Code"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminCodeSettings;
