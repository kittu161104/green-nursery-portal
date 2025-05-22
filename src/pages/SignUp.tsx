import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp, currentUser } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to appropriate page
  useEffect(() => {
    if (currentUser) {
      if (currentUser.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!fullName.trim()) {
      setError("Please enter your name");
      return;
    }
    
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (adminMode && !adminCode.trim()) {
      setError("Admin code is required for admin access");
      return;
    }
    
    setLoading(true);
    try {
      await signUp(email, password, fullName, adminMode ? adminCode : undefined);
      
      // Don't navigate immediately, show a success message and redirect to sign in
      toast.success("Account created successfully! Please sign in.");
      navigate('/signin');
    } catch (error: any) {
      console.error("Signup error:", error);
      
      if (error.message && error.message.includes("rate limit")) {
        setError("Too many signup attempts. Please try again later or sign in if you already have an account.");
      } else {
        setError(error.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return null; // Prevents flash of content during redirect
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md border-green-900/30 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-green-300">Create an account</CardTitle>
            <CardDescription className="text-green-500">
              Sign up to access exclusive plant care tips and special offers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-950/20 border border-red-900/50 text-red-300 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-green-300">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-black/50 border-green-900/50 text-green-200 placeholder:text-green-800"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-black/50 border-green-900/50 text-green-200 placeholder:text-green-800"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="bg-black/50 border-green-900/50 text-green-200 placeholder:text-green-800"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-green-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="bg-black/50 border-green-900/50 text-green-200 placeholder:text-green-800"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="adminMode" 
                  checked={adminMode} 
                  onCheckedChange={(checked) => setAdminMode(checked === true)}
                />
                <Label htmlFor="adminMode" className="text-green-300">
                  Sign up as administrator
                </Label>
              </div>
              
              {adminMode && (
                <div className="space-y-2 pt-1">
                  <Label htmlFor="adminCode" className="text-green-300">Admin Code</Label>
                  <Input
                    id="adminCode"
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="Enter admin code"
                    className="bg-black/50 border-green-900/50 text-green-200 placeholder:text-green-800"
                    required={adminMode}
                  />
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-green-800 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-green-400">
              Already have an account?{" "}
              <Link to="/signin" className="text-green-300 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
