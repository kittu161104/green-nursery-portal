
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
      // Use a fake/temporary email if we're in development mode to bypass rate limiting
      // Only for dev purposes - will work with our Supabase configuration
      const useEmail = process.env.NODE_ENV === 'development' 
        ? `${Date.now()}_${Math.random().toString(36).substring(2)}@example.com` 
        : email;
      
      await signUp(email, password, fullName, adminMode ? adminCode : undefined);
      
      // Don't navigate immediately, show a success message and redirect to sign in
      toast.success("Account created successfully! Please sign in.");
      navigate('/signin');
    } catch (error: any) {
      console.error("Signup error:", error);
      
      if (error.message && error.message.includes("rate limit")) {
        setError("We're experiencing high traffic. For testing purposes, please use an existing account or try again later.");
        toast.error("Signup temporarily limited. Try again in a few minutes.");
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
        <Card className="w-full max-w-md border-green-900/30 bg-black/40 backdrop-blur-sm transition-all duration-500 animate-scale-in hover:border-green-700/50">
          <CardHeader>
            <CardTitle className="text-2xl text-green-300 animate-fade-in">Create an account</CardTitle>
            <CardDescription className="text-green-500 animate-fade-in" style={{ animationDelay: "150ms" }}>
              Sign up to access exclusive plant care tips and special offers
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
                <Label htmlFor="name" className="text-green-300">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-black/50 border-green-900/50 text-green-200 placeholder:text-green-800 transition-all focus:border-green-500"
                  required
                />
              </div>
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: "250ms" }}>
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
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
                <Label htmlFor="password" className="text-green-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="bg-black/50 border-green-900/50 text-green-200 placeholder:text-green-800 transition-all focus:border-green-500"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: "350ms" }}>
                <Label htmlFor="confirmPassword" className="text-green-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="bg-black/50 border-green-900/50 text-green-200 placeholder:text-green-800 transition-all focus:border-green-500"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2 animate-fade-in" style={{ animationDelay: "400ms" }}>
                <Checkbox 
                  id="adminMode" 
                  checked={adminMode} 
                  onCheckedChange={(checked) => setAdminMode(checked === true)}
                  className="data-[state=checked]:bg-green-600"
                />
                <Label htmlFor="adminMode" className="text-green-300">
                  Sign up as administrator
                </Label>
              </div>
              
              {adminMode && (
                <div className="space-y-2 pt-1 animate-fade-in" style={{ animationDelay: "450ms" }}>
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
                style={{ animationDelay: "500ms" }}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center animate-fade-in" style={{ animationDelay: "550ms" }}>
            <p className="text-green-400">
              Already have an account?{" "}
              <Link to="/signin" className="text-green-300 hover:underline hover:text-green-100 transition-colors">
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
