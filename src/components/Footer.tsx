
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Facebook, Instagram, MessageSquare } from "lucide-react";

interface ContactInfo {
  id?: string;
  address_line1: string;
  address_line2: string;
  phone: string;
  email: string;
  facebook_url?: string;
  instagram_url?: string;
  whatsapp_url?: string;
}

const Footer = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address_line1: "123 Green Street",
    address_line2: "Plantville, CA 94123",
    phone: "(555) 123-4567",
    email: "info@naturalgreenursery.com",
    facebook_url: "https://facebook.com",
    instagram_url: "https://instagram.com",
    whatsapp_url: "https://whatsapp.com"
  });

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
    <footer className="bg-black border-t border-green-900/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xl font-bold text-green-300 mb-4">Natural Green Nursery</h3>
            <p className="text-green-500 mb-4">Bring nature into your home with beautiful, carefully selected plants.</p>
            <div className="flex space-x-4">
              <a href={contactInfo.facebook_url || "#"} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href={contactInfo.instagram_url || "#"} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href={contactInfo.whatsapp_url || "#"} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
                <span className="sr-only">WhatsApp</span>
                <MessageSquare className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-green-300 mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-green-500 hover:text-green-300">
                  Shop Plants
                </Link>
              </li>
              <li>
                <Link to="/plant-care-guides" className="text-green-500 hover:text-green-300">
                  Plant Care Guides
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-green-500 hover:text-green-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-green-500 hover:text-green-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-green-300 mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping-info" className="text-green-500 hover:text-green-300">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-green-500 hover:text-green-300">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-green-300 mb-4">Contact</h3>
            <address className="not-italic">
              <p className="text-green-500 mb-2">
                {contactInfo.address_line1}
              </p>
              <p className="text-green-500 mb-2">
                {contactInfo.address_line2}
              </p>
              <p className="text-green-500 mb-2">
                <a href={`tel:${contactInfo.phone}`} className="hover:text-green-300">
                  {contactInfo.phone}
                </a>
              </p>
              <p className="text-green-500 mb-2">
                <a href={`mailto:${contactInfo.email}`} className="hover:text-green-300">
                  {contactInfo.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-8 border-t border-green-900/30 pt-6">
          <p className="text-center text-green-600">
            &copy; {new Date().getFullYear()} Natural Green Nursery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
