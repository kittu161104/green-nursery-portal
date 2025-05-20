
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface ReturnsInfo {
  id?: string;
  title: string;
  content: string;
  updated_at?: string;
}

const Returns = () => {
  const [returnsInfo, setReturnsInfo] = useState<ReturnsInfo>({
    title: "Returns & Refunds",
    content: "<p>We want you to be completely satisfied with your purchase. If for any reason you're not happy with your order, we're here to help.</p><h3>Return Policy</h3><ul><li>Plants: Returns accepted within 7 days of delivery if plant is unhealthy upon arrival</li><li>Plant Accessories: Returns accepted within 30 days if unused and in original packaging</li></ul><h3>How to Return</h3><p>To initiate a return, please email us at returns@naturalgreenursery.com with your order number and reason for return. We'll provide you with return instructions.</p><h3>Refund Process</h3><p>Once we receive your return, we'll inspect the item and process your refund within 5-7 business days. Refunds will be issued to the original payment method.</p>"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturnsInfo = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('returns_info')
          .select('*')
          .maybeSingle();

        if (error) {
          console.error("Error fetching returns info:", error);
        } else if (data) {
          setReturnsInfo(data as ReturnsInfo);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReturnsInfo();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-grow">
        <div className="relative py-16">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1604762524889-3e2fcc145683?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
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
              <h1 className="text-4xl font-bold text-green-300 text-center mb-8">{returnsInfo.title}</h1>
              
              <div className="glass-card max-w-3xl mx-auto p-8 rounded-xl shadow-2xl mb-12 bg-black/40 border border-green-900/50 backdrop-blur-md">
                <div 
                  className="text-green-200 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: returnsInfo.content }}
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

export default Returns;
