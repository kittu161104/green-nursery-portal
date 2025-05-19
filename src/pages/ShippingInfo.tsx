
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface ShippingInfo {
  id?: string;
  title: string;
  content: string;
  updated_at?: string;
}

const ShippingInfo = () => {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    title: "Shipping Information",
    content: "<p>We ship across India with multiple shipping options. Usually, orders are processed within 1-2 business days.</p><h3>Shipping Methods</h3><ul><li>Standard Shipping (3-5 business days): ₹99</li><li>Express Shipping (1-2 business days): ₹199</li></ul><h3>Important Notes</h3><p>For plant orders, we carefully package plants to ensure they arrive in excellent condition. If your plant arrives damaged, please contact us within 24 hours with photos.</p>"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShippingInfo = async () => {
      try {
        setLoading(true);
        // The type error was here - the table was missing in the database
        const { data, error } = await supabase
          .from('shipping_info')
          .select('*')
          .maybeSingle();

        if (error) {
          console.error("Error fetching shipping info:", error);
        } else if (data) {
          setShippingInfo(data as ShippingInfo);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShippingInfo();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-grow">
        <div className="relative py-16">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1622372738946-62e02505feb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              alt="Plants background"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-green-950/40 to-black/90 backdrop-blur-sm"></div>
          </div>

          {loading ? (
            <div className="container mx-auto px-6 py-12 relative z-10">
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-green-900/50 rounded w-3/4 mx-auto"></div>
                <div className="h-40 bg-green-900/30 rounded max-w-3xl mx-auto"></div>
              </div>
            </div>
          ) : (
            <div className="container mx-auto px-6 py-12 relative z-10">
              <h1 className="text-4xl font-bold text-green-300 text-center mb-8">{shippingInfo.title}</h1>
              
              <div className="glass-card max-w-3xl mx-auto p-8 rounded-xl shadow-2xl mb-12 bg-black/40 border border-green-900/50 backdrop-blur-md">
                <div 
                  className="text-green-200 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: shippingInfo.content }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingInfo;
