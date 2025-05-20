
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PlantCareGuides from "./pages/PlantCareGuides";
import ShippingInfo from "./pages/ShippingInfo";
import Returns from "./pages/Returns";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import AboutAdmin from "./pages/admin/AboutAdmin";
import ContactAdmin from "./pages/admin/ContactAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import CustomersAdmin from "./pages/admin/CustomersAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import PlantCareGuidesAdmin from "./pages/admin/PlantCareGuidesAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/plant-care-guides" element={<PlantCareGuides />} />
              <Route path="/shipping-info" element={<ShippingInfo />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Customer Routes */}
              <Route path="/account" element={<Account />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ProductsAdmin />} />
              <Route path="/admin/about" element={<AboutAdmin />} />
              <Route path="/admin/contact" element={<ContactAdmin />} />
              <Route path="/admin/orders" element={<OrdersAdmin />} />
              <Route path="/admin/customers" element={<CustomersAdmin />} />
              <Route path="/admin/settings" element={<SettingsAdmin />} />
              <Route path="/admin/plant-care-guides" element={<PlantCareGuidesAdmin />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
