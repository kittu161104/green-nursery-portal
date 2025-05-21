
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError("");
      await signIn(email, password);
      
      // Redirect based on email domain
      if (email && email.endsWith("@nature.com")) {
        navigate("/admin");
      } else {
        navigate("/account");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      setError(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Background plants"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-green-950/20 to-black/90 backdrop-blur-sm"></div>
        </div>
        
        <div className="mx-auto w-full max-w-md relative z-10">
          <div className="glass-effect px-8 py-10 shadow-lg rounded-lg border border-green-800/30 backdrop-blur-lg transition-all duration-300 hover:shadow-green-900/20 hover:border-green-700/40">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="text-center text-3xl font-bold tracking-tight text-green-300">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-green-500">
                Or{" "}
                <Link
                  to="/signup"
                  className="font-medium text-green-400 hover:text-green-300 transition-colors"
                >
                  create a new account
                </Link>
              </p>
            </div>

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md bg-red-900/30 border border-red-800/50 p-4">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
              
              <div>
                <Label htmlFor="email" className="text-green-300">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="mt-1 bg-black/40 border-green-900/50 text-green-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-green-300">Password</Label>
                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-green-400 hover:text-green-300 transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="mt-1 bg-black/40 border-green-900/50 text-green-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-800 hover:bg-green-700 text-green-300 border border-green-700 transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              
              <div className="text-sm text-center text-green-500">
                <p>
                  For demo: use customer@gmail.com for customer access<br />
                  or admin@nature.com for admin access<br />
                  (password: password123 for both)
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
