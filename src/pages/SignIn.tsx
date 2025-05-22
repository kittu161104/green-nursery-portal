
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
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [showAdminCode, setShowAdminCode] = useState(false);
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
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return null; // Prevents flash of content during redirect
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleAdminCodeVisibility = () => setShowAdminCode(!showAdminCode);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-grow flex items-center justify-center p-4 md:p-8"
      >
        <Card className="w-full max-w-md border-green-900/30 bg-black/40 backdrop-blur-sm transition-all duration-500 hover:border-green-700/50">
          <CardHeader>
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <CardTitle className="text-2xl text-green-300">Welcome back</CardTitle>
              <CardDescription className="text-green-500">
                Sign in to your account to access your plant care guides and order history
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-950/20 border border-red-900/50 text-red-300 p-3 rounded-md mb-4"
              >
                {error}
              </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
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
              </motion.div>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-green-300">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-green-400 hover:text-green-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-black/50 border-green-900/50 text-green-200 placeholder:text-green-800 transition-all focus:border-green-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-2"
              >
                <Checkbox 
                  id="adminMode" 
                  checked={adminMode} 
                  onCheckedChange={(checked) => setAdminMode(checked === true)}
                  className="data-[state=checked]:bg-green-600"
                />
                <Label htmlFor="adminMode" className="text-green-300">
                  Sign in as administrator
                </Label>
              </motion.div>
              
              {adminMode && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2 pt-1"
                >
                  <Label htmlFor="adminCode" className="text-green-300">Admin Code</Label>
                  <div className="relative">
                    <Input
                      id="adminCode"
                      type={showAdminCode ? "text" : "password"}
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="Enter admin code"
                      className="bg-black/50 border-green-900/50 text-green-200 placeholder:text-green-800 transition-all focus:border-green-500 pr-10"
                      required={adminMode}
                    />
                    <button
                      type="button"
                      onClick={toggleAdminCodeVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-400"
                    >
                      {showAdminCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>
              )}
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-green-800 hover:bg-green-700 text-white transition-colors duration-300 transform hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-green-400"
            >
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-300 hover:underline hover:text-green-100 transition-colors">
                Sign up
              </Link>
            </motion.p>
          </CardFooter>
        </Card>
      </motion.div>
      <Footer />
    </div>
  );
};

export default SignIn;
