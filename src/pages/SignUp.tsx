
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      
      await signUp(name, email, password);
      
      // Redirect based on email domain
      if (email && email.endsWith("@nature.com")) {
        navigate("/admin");
      } else {
        navigate("/account");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setError("Failed to create an account. Please try again.");
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
                Create a new account
              </h2>
              <p className="mt-2 text-center text-sm text-green-500">
                Or{" "}
                <Link
                  to="/signin"
                  className="font-medium text-green-400 hover:text-green-300 transition-colors"
                >
                  sign in to your account
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
                <Label htmlFor="name" className="text-green-300">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="mt-1 bg-black/40 border-green-900/50 text-green-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

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
                <p className="mt-1 text-xs text-green-500">
                  Note: Use @nature.com domain for admin access, or @gmail.com for customer access.
                </p>
              </div>

              <div>
                <Label htmlFor="password" className="text-green-300">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="mt-1 bg-black/40 border-green-900/50 text-green-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-green-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="mt-1 bg-black/40 border-green-900/50 text-green-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-800 hover:bg-green-700 text-green-300 border border-green-700 transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
