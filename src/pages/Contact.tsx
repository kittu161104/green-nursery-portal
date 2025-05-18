
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactInfo {
  id?: string;
  address_line1: string;
  address_line2: string;
  phone: string;
  email: string;
}

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address_line1: "Loading...",
    address_line2: "Loading...",
    phone: "Loading...",
    email: "Loading..."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_info')
          .select('*')
          .single();

        if (error) {
          console.error("Error fetching contact info:", error);
        } else if (data) {
          setContactInfo(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema_db_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'contact_info' 
      }, payload => {
        setContactInfo(payload.new as ContactInfo);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-grow">
        <div className="relative py-16">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1585184394271-4c0a47dc59c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              alt="Plants background"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-green-950/40 to-black/90 backdrop-blur-sm"></div>
          </div>

          <div className="container mx-auto px-6 py-12 relative z-10">
            <h1 className="text-4xl font-bold text-green-300 text-center mb-8">Contact Us</h1>
            
            {loading ? (
              <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
                <div className="h-24 bg-green-900/30 rounded"></div>
                <div className="h-24 bg-green-900/30 rounded"></div>
                <div className="h-24 bg-green-900/30 rounded"></div>
              </div>
            ) : (
              <div className="glass-card max-w-3xl mx-auto p-8 rounded-xl shadow-2xl">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <div className="space-y-8">
                      <div className="flex items-start space-x-4">
                        <MapPin className="text-green-400 flex-shrink-0 mt-1" size={24} />
                        <div>
                          <h2 className="text-xl font-semibold text-green-300 mb-2">Our Location</h2>
                          <p className="text-green-200">{contactInfo.address_line1}</p>
                          <p className="text-green-200">{contactInfo.address_line2}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <Phone className="text-green-400 flex-shrink-0 mt-1" size={24} />
                        <div>
                          <h2 className="text-xl font-semibold text-green-300 mb-2">Phone</h2>
                          <p className="text-green-200">{contactInfo.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <Mail className="text-green-400 flex-shrink-0 mt-1" size={24} />
                        <div>
                          <h2 className="text-xl font-semibold text-green-300 mb-2">Email</h2>
                          <p className="text-green-200">{contactInfo.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-64 md:h-auto">
                    <div className="h-full glass-effect p-2 rounded-xl">
                      <div className="h-full w-full bg-green-900/20 rounded-lg border border-green-800/30 flex items-center justify-center">
                        <p className="text-green-400 text-center p-4">Map would be displayed here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
