
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Heart, 
  Package, 
  Truck, 
  RotateCcw, 
  History, 
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { currentUser, signOut } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-green-900/30 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-green-500">
            Natural Green Nursery
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors">
            Home
          </Link>
          <Link to="/shop" className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors">
            Shop
          </Link>
          <Link to="/about" className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors">
            Contact
          </Link>
          <Link to="/plant-care-guides" className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors">
            Care Guides
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="hidden md:flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 w-8 rounded-full hover:bg-green-900/20 text-green-400"
                  >
                    <User size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-black/80 backdrop-blur-md border-green-900/30"
                  align="end"
                >
                  <DropdownMenuLabel className="text-green-300">
                    {currentUser.fullName || 'User'}
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs text-green-500 font-normal -mt-2">
                    {currentUser.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-green-900/30" />
                  <DropdownMenuGroup>
                    <Link to={currentUser.isAdmin ? "/admin" : "/account"}>
                      <DropdownMenuItem className="text-green-400 hover:bg-green-900/30 hover:text-green-300 cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>My Account</span>
                      </DropdownMenuItem>
                    </Link>
                    {!currentUser.isAdmin && (
                      <>
                        <Link to="/account?tab=wishlist">
                          <DropdownMenuItem className="text-green-400 hover:bg-green-900/30 hover:text-green-300 cursor-pointer">
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Wishlist</span>
                          </DropdownMenuItem>
                        </Link>
                        <Link to="/account?tab=orders">
                          <DropdownMenuItem className="text-green-400 hover:bg-green-900/30 hover:text-green-300 cursor-pointer">
                            <Package className="mr-2 h-4 w-4" />
                            <span>Orders</span>
                          </DropdownMenuItem>
                        </Link>
                        <Link to="/account?tab=tracking">
                          <DropdownMenuItem className="text-green-400 hover:bg-green-900/30 hover:text-green-300 cursor-pointer">
                            <Truck className="mr-2 h-4 w-4" />
                            <span>Order Tracking</span>
                          </DropdownMenuItem>
                        </Link>
                        <Link to="/account?tab=returns">
                          <DropdownMenuItem className="text-green-400 hover:bg-green-900/30 hover:text-green-300 cursor-pointer">
                            <RotateCcw className="mr-2 h-4 w-4" />
                            <span>Returns</span>
                          </DropdownMenuItem>
                        </Link>
                        <Link to="/account?tab=history">
                          <DropdownMenuItem className="text-green-400 hover:bg-green-900/30 hover:text-green-300 cursor-pointer">
                            <History className="mr-2 h-4 w-4" />
                            <span>Order History</span>
                          </DropdownMenuItem>
                        </Link>
                        <Link to="/account?tab=settings">
                          <DropdownMenuItem className="text-green-400 hover:bg-green-900/30 hover:text-green-300 cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Account Settings</span>
                          </DropdownMenuItem>
                        </Link>
                      </>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-green-900/30" />
                  <DropdownMenuItem 
                    className="text-red-400 hover:bg-red-900/30 hover:text-red-300 cursor-pointer"
                    onClick={signOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/signin">
              <Button 
                variant="ghost" 
                className="text-sm font-medium text-green-400 hover:text-green-300 hover:bg-green-900/20"
              >
                Sign In
              </Button>
            </Link>
          )}

          <Link to="/cart" className="relative">
            <Button 
              variant="ghost" 
              className="h-8 w-8 rounded-full hover:bg-green-900/20 text-green-400 p-0"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-green-900/20 text-green-400 p-0 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-black/95 backdrop-blur-md p-6 md:hidden border-t border-green-900/30">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              className="text-lg font-medium p-2 text-green-400 hover:bg-green-900/20 hover:text-green-300 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-lg font-medium p-2 text-green-400 hover:bg-green-900/20 hover:text-green-300 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-lg font-medium p-2 text-green-400 hover:bg-green-900/20 hover:text-green-300 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-lg font-medium p-2 text-green-400 hover:bg-green-900/20 hover:text-green-300 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/plant-care-guides"
              className="text-lg font-medium p-2 text-green-400 hover:bg-green-900/20 hover:text-green-300 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Care Guides
            </Link>
            
            {currentUser && (
              <>
                <div className="h-px bg-green-900/30 my-2"></div>
                <Link
                  to={currentUser.isAdmin ? "/admin" : "/account"}
                  className="text-lg font-medium p-2 text-green-400 hover:bg-green-900/20 hover:text-green-300 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="inline-block mr-2 h-5 w-5" />
                  {currentUser.isAdmin ? "Admin Dashboard" : "My Account"}
                </Link>
                {!currentUser.isAdmin && (
                  <>
                    <Link
                      to="/account?tab=wishlist"
                      className="text-lg font-medium p-2 text-green-400 hover:bg-green-900/20 hover:text-green-300 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Heart className="inline-block mr-2 h-5 w-5" />
                      Wishlist
                    </Link>
                    <Link
                      to="/account?tab=orders"
                      className="text-lg font-medium p-2 text-green-400 hover:bg-green-900/20 hover:text-green-300 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Package className="inline-block mr-2 h-5 w-5" />
                      Orders
                    </Link>
                  </>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-lg font-medium justify-start p-2 h-auto text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-md transition-colors"
                >
                  <LogOut className="mr-2 h-5 w-5" />
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
