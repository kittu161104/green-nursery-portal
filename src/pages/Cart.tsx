
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  X, 
  CreditCard, 
  Wallet, 
  Phone, 
  CheckCircle2,
  Loader2,
  RefreshCw
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi">("cash");
  const [upiId, setUpiId] = useState("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  const [storeUpiId, setStoreUpiId] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentVerifying, setPaymentVerifying] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Calculate tax and total
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + tax;

  useEffect(() => {
    // Fetch store UPI ID when component mounts
    const fetchStoreUpiId = async () => {
      try {
        const { data } = await supabase
          .from('admin_settings')
          .select('upi_id')
          .single();
        
        if (data?.upi_id) {
          setStoreUpiId(data.upi_id);
        } else {
          // Default UPI if not set up
          setStoreUpiId("naturalgreenursery@ybl");
        }
      } catch (error) {
        console.error("Error fetching UPI:", error);
        setStoreUpiId("naturalgreenursery@ybl");
      }
    };

    fetchStoreUpiId();
  }, []);

  const handleQuantityChange = (productId: string, quantity: string) => {
    const newQuantity = parseInt(quantity, 10);
    if (!isNaN(newQuantity)) {
      updateQuantity(productId, newQuantity);
    }
  };
  
  const handleCheckout = async () => {
    if (!currentUser) {
      toast.error("Please sign in to checkout");
      navigate("/signin");
      return;
    }
    
    setShowPaymentDialog(true);
  };
  
  const processPayment = async () => {
    if (paymentMethod === "upi" && !upiId.trim()) {
      toast.error("Please enter your UPI ID");
      return;
    }
    
    setIsCheckingOut(true);
    setPaymentStep(2);
    
    try {
      // Create order in database
      const { data: orderData, error: orderError } = await supabase.from('orders').insert({
        user_id: currentUser?.id,
        total_amount: grandTotal,
        payment_method: paymentMethod,
        payment_status: paymentMethod === "cash" ? "pending" : "processing",
        items: cart,
        shipping_status: "pending",
        created_at: new Date().toISOString()
      }).select();
      
      if (orderError) throw orderError;
      
      // Set order ID for reference
      if (orderData && orderData.length > 0) {
        setOrderId(orderData[0].id);
      }
      
      // If payment method is UPI, simulate payment verification
      if (paymentMethod === "upi") {
        setPaymentVerifying(true);
        
        // Simulate UPI payment verification (in a real app, you would integrate with a UPI provider)
        setTimeout(() => {
          setPaymentVerifying(false);
          setPaymentVerified(true);
          
          // Update order status after payment verification
          supabase.from('orders').update({
            payment_status: "completed"
          }).eq('id', orderId);
          
          setPaymentStep(3);
          setOrderPlaced(true);
          
          // Clear cart after successful payment
          setTimeout(() => {
            clearCart();
            setShowPaymentDialog(false);
            setIsCheckingOut(false);
            navigate("/account?tab=orders");
            toast.success("Order placed successfully! Thank you for your purchase.");
          }, 2000);
        }, 3000);
      } else {
        // For cash on delivery, just mark the order as placed
        setPaymentStep(3);
        setOrderPlaced(true);
        
        // Clear cart after successful order placement
        setTimeout(() => {
          clearCart();
          setShowPaymentDialog(false);
          setIsCheckingOut(false);
          navigate("/account?tab=orders");
          toast.success("Order placed successfully! Thank you for your purchase.");
        }, 2000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("There was a problem processing your order");
      setIsCheckingOut(false);
    }
  };

  // Function to generate deep link for UPI payment apps
  const generateUpiDeepLink = () => {
    const amount = grandTotal.toFixed(2);
    const desc = `Payment for Order at Natural Green Nursery`;
    
    // Generate a UPI intent URL that works with most UPI apps
    return `upi://pay?pa=${storeUpiId}&pn=NaturalGreenNursery&am=${amount}&cu=INR&tn=${desc}`;
  };

  // Function to open UPI payment app
  const openUpiPaymentApp = () => {
    const deepLink = generateUpiDeepLink();
    window.location.href = deepLink;
    
    // Start checking for payment verification (simulated)
    setPaymentVerifying(true);
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
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
                
                <div className="mt-6">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Checkout
                  </Button>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>We accept UPI payments and Cash on Delivery</p>
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
        
        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Your Purchase</DialogTitle>
              <DialogDescription>
                Select your preferred payment method
              </DialogDescription>
            </DialogHeader>
            
            {!orderPlaced ? (
              paymentStep === 1 ? (
                <>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(value: "cash" | "upi") => setPaymentMethod(value)}
                    className="gap-4"
                  >
                    <div>
                      <Card className={`border cursor-pointer ${paymentMethod === "cash" ? "border-green-500" : "border-gray-200"}`}>
                        <CardContent className="p-4 flex items-center gap-4">
                          <RadioGroupItem value="cash" id="cash" className="text-green-500" />
                          <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                            <Wallet className="h-5 w-5" />
                            Cash on Delivery
                          </Label>
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <Card className={`border cursor-pointer ${paymentMethod === "upi" ? "border-green-500" : "border-gray-200"}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4 mb-4">
                            <RadioGroupItem value="upi" id="upi" className="text-green-500" />
                            <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                              <Phone className="h-5 w-5" />
                              Pay with UPI
                            </Label>
                          </div>
                          {paymentMethod === "upi" && (
                            <div className="pl-8">
                              <p className="text-sm mb-2">Send payment to UPI ID:</p>
                              <p className="font-medium mb-4">{storeUpiId}</p>
                              <Label htmlFor="upi-id" className="text-sm">Your UPI ID</Label>
                              <Input
                                id="upi-id"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="yourname@bank"
                                className="mt-1"
                              />
                              <p className="text-xs text-gray-500 mt-2">
                                We'll verify your payment using this UPI ID
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </RadioGroup>
                
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={processPayment}>
                      {paymentMethod === "cash" ? "Place Order" : "Continue to Payment"}
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center">
                  {paymentMethod === "upi" && paymentVerifying ? (
                    <>
                      <RefreshCw className="h-10 w-10 text-green-500 animate-spin mb-4" />
                      <p className="text-lg font-medium">Waiting for payment...</p>
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Please complete the payment in your UPI app
                      </p>
                      <Button 
                        onClick={openUpiPaymentApp} 
                        className="mt-4 bg-green-600"
                      >
                        Open UPI Payment App
                      </Button>
                    </>
                  ) : (
                    <>
                      <Loader2 className="h-10 w-10 text-green-500 animate-spin mb-4" />
                      <p className="text-lg font-medium">
                        {paymentMethod === "cash" ? "Processing your order..." : "Confirming payment..."}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Please don't close this window
                      </p>
                    </>
                  )}
                </div>
              )
            ) : (
              <div className="py-8 flex flex-col items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg font-medium">
                  {paymentMethod === "cash" ? "Order placed successfully!" : "Payment confirmed!"}
                </p>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  {paymentMethod === "cash" 
                    ? "Your order has been placed. You'll pay when your order is delivered." 
                    : "Thank you for your payment. Your order has been confirmed."}
                </p>
                <p className="text-sm font-medium mt-4">
                  Order ID: {orderId || "Generated"}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
