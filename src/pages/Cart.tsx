
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { X } from "lucide-react";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, quantity: string) => {
    const newQuantity = parseInt(quantity, 10);
    if (!isNaN(newQuantity)) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // In a real app, this would redirect to a checkout page or process the order
    setTimeout(() => {
      toast.success("Order placed successfully! Thank you for your purchase.");
      clearCart();
      navigate("/");
      setIsCheckingOut(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        
        {cart.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-2/3">
              <div className="hidden md:flex text-sm font-medium text-gray-500 border-b border-gray-200 pb-2 mb-4">
                <div className="w-1/2">Product</div>
                <div className="w-1/6 text-center">Price</div>
                <div className="w-1/6 text-center">Quantity</div>
                <div className="w-1/6 text-center">Total</div>
              </div>
              
              {cart.map((item) => (
                <div key={item.productId} className="flex flex-col md:flex-row items-center py-4 border-b">
                  <div className="w-full md:w-1/2 flex items-center mb-4 md:mb-0">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-base font-medium">
                            <Link to={`/product/${item.productId}`} className="hover:text-green-600">
                              {item.product.name}
                            </Link>
                          </h3>
                          <button
                            type="button"
                            className="ml-4 text-gray-400 hover:text-gray-500 md:hidden"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.product.category.charAt(0).toUpperCase() + item.product.category.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/6 flex justify-between md:justify-center items-center mb-4 md:mb-0">
                    <span className="block md:hidden text-sm font-medium text-gray-500">Price:</span>
                    <span className="text-sm font-medium text-gray-900">${item.product.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="w-full md:w-1/6 flex justify-between md:justify-center items-center mb-4 md:mb-0">
                    <span className="block md:hidden text-sm font-medium text-gray-500">Quantity:</span>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="p-1 text-gray-600 hover:text-gray-800"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        -
                      </button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                        className="w-12 text-center mx-1"
                      />
                      <button
                        type="button"
                        className="p-1 text-gray-600 hover:text-gray-800"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/6 flex justify-between md:justify-center items-center">
                    <span className="block md:hidden text-sm font-medium text-gray-500">Total:</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${(item.quantity * item.product.price).toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    className="hidden md:block text-gray-400 hover:text-gray-500 ml-4"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
              
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => navigate("/shop")}
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
            
            <div className="w-full lg:w-1/3 mt-10 lg:mt-0">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Items ({totalItems})</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${(totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <span>Total</span>
                  <span>${(totalPrice + (totalPrice * 0.08)).toFixed(2)}</span>
                </div>
                
                <div className="mt-6">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? "Processing..." : "Checkout"}
                  </Button>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>We accept credit cards, PayPal, and ApplePay</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any plants to your cart yet.</p>
            <Link to="/shop">
              <Button className="bg-green-600 hover:bg-green-700">
                Browse Plants
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
