
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Menu, X, User } from "lucide-react";

const Navbar = () => {
  const { currentUser, signOut } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-green-700">
            Natural Green Nursery
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-green-600 transition-colors">
            Home
          </Link>
          <Link to="/shop" className="text-sm font-medium hover:text-green-600 transition-colors">
            Shop
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-green-600 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-green-600 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="hidden md:flex items-center gap-4">
              <Link
                to={currentUser.isAdmin ? "/admin" : "/account"}
                className="flex items-center gap-2 text-sm font-medium hover:text-green-600 transition-colors"
              >
                <User size={18} />
                <span className="hidden md:inline">{currentUser.name}</span>
              </Link>
              <Button
                variant="ghost"
                onClick={signOut}
                className="text-sm font-medium"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/signin">
              <Button variant="ghost" className="text-sm font-medium">
                Sign In
              </Button>
            </Link>
          )}

          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-white p-6 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              className="text-lg font-medium p-2 hover:bg-green-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-lg font-medium p-2 hover:bg-green-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-lg font-medium p-2 hover:bg-green-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-lg font-medium p-2 hover:bg-green-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            {currentUser && (
              <>
                <Link
                  to={currentUser.isAdmin ? "/admin" : "/account"}
                  className="text-lg font-medium p-2 hover:bg-green-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {currentUser.isAdmin ? "Admin Dashboard" : "My Account"}
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-lg font-medium justify-start p-2 h-auto hover:bg-green-50 hover:text-black rounded-md"
                >
                  Sign Out
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
