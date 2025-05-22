
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

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, currentUser } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect appropriately
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
    setLoading(true);
    
    try {
      await signIn(email, password, adminMode ? adminCode : undefined);
      // Don't navigate, the auth state changes will trigger useEffect
      toast.success("Signed in successfully! Redirecting...");
    } catch (err: any) {
      const errorMsg = err.message || "Failed to sign in";
      setError(errorMsg);
      
      // Handle rate limiting specifically
      if (errorMsg.toLowerCase().includes("too many requests") || 
          errorMsg.toLowerCase().includes("rate limit")) {
        setError("Sign in attempts temporarily limited. Please try again in a few minutes.");
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
        <Card className="w-full max-w-md border-green-900/30 bg-black/40 backdrop-blur-sm transition-all duration-500 animate-scale-in hover:border-green-700/50">
          <CardHeader>
            <CardTitle className="text-2xl text-green-300 animate-fade-in">Welcome back</CardTitle>
            <CardDescription className="text-green-500 animate-fade-in" style={{ animationDelay: "150ms" }}>
              Sign in to your account to access your plant care guides and order history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-950/20 border border-red-900/50 text-red-300 p-3 rounded-md mb-4 animate-fade-in">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <Label htmlFor="email" className="text-green-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-black/50 border-green-900/50 text-green-200 placeholder:text-green-800 transition-all focus:border-green-500"
                  required
                />
              </div>
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: "250ms" }}>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-green-300">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-green-400 hover:text-green-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-black/50 border-green-900/50 text-green-200 placeholder:text-green-800 transition-all focus:border-green-500"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
                <Checkbox 
                  id="adminMode" 
                  checked={adminMode} 
                  onCheckedChange={(checked) => setAdminMode(checked === true)}
                  className="data-[state=checked]:bg-green-600"
                />
                <Label htmlFor="adminMode" className="text-green-300">
                  Sign in as administrator
                </Label>
              </div>
              
              {adminMode && (
                <div className="space-y-2 pt-1 animate-fade-in" style={{ animationDelay: "350ms" }}>
                  <Label htmlFor="adminCode" className="text-green-300">Admin Code</Label>
                  <Input
                    id="adminCode"
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="Enter admin code"
                    className="bg-black/50 border-green-900/50 text-green-200 placeholder:text-green-800 transition-all focus:border-green-500"
                    required={adminMode}
                  />
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-green-800 hover:bg-green-700 text-white transition-colors duration-300 animate-fade-in transform hover:scale-[1.02]"
                style={{ animationDelay: "400ms" }}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center animate-fade-in" style={{ animationDelay: "500ms" }}>
            <p className="text-green-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-300 hover:underline hover:text-green-100 transition-colors">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
