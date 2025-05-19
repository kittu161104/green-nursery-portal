
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent } from "@/components/ui/card";

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

const ContactInfoEditor = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address_line1: "",
    address_line2: "",
    phone: "",
    email: "",
    facebook_url: "",
    instagram_url: "",
    whatsapp_url: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('contact_info')
          .select('*')
          .maybeSingle();

        if (error) {
          toast.error("Error fetching contact info");
          console.error("Error fetching contact info:", error);
        } else if (data) {
          setContactInfo(data as ContactInfo);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (contactInfo.id) {
        // Update existing contact info
        const { error } = await supabase
          .from('contact_info')
          .update({
            address_line1: contactInfo.address_line1,
            address_line2: contactInfo.address_line2,
            phone: contactInfo.phone,
            email: contactInfo.email,
            facebook_url: contactInfo.facebook_url,
            instagram_url: contactInfo.instagram_url,
            whatsapp_url: contactInfo.whatsapp_url
          })
          .eq('id', contactInfo.id);

        if (error) {
          toast.error("Failed to update contact info");
          console.error("Error updating contact info:", error);
          return;
        }
      } else {
        // Insert new contact info
        const { error } = await supabase
          .from('contact_info')
          .insert([{
            address_line1: contactInfo.address_line1,
            address_line2: contactInfo.address_line2,
            phone: contactInfo.phone,
            email: contactInfo.email,
            facebook_url: contactInfo.facebook_url,
            instagram_url: contactInfo.instagram_url,
            whatsapp_url: contactInfo.whatsapp_url
          }]);

        if (error) {
          toast.error("Failed to save contact info");
          console.error("Error inserting contact info:", error);
          return;
        }
      }

      toast.success("Contact information saved successfully");
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading contact information...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="address_line1">Address Line 1</Label>
          <Input
            id="address_line1"
            name="address_line1"
            value={contactInfo.address_line1}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="address_line2">Address Line 2</Label>
          <Input
            id="address_line2"
            name="address_line2"
            value={contactInfo.address_line2}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={contactInfo.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={contactInfo.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="facebook_url">Facebook URL</Label>
              <Input
                id="facebook_url"
                name="facebook_url"
                value={contactInfo.facebook_url || ""}
                onChange={handleChange}
                placeholder="https://facebook.com/your-page"
              />
            </div>
            
            <div>
              <Label htmlFor="instagram_url">Instagram URL</Label>
              <Input
                id="instagram_url"
                name="instagram_url"
                value={contactInfo.instagram_url || ""}
                onChange={handleChange}
                placeholder="https://instagram.com/your-handle"
              />
            </div>
            
            <div>
              <Label htmlFor="whatsapp_url">WhatsApp URL</Label>
              <Input
                id="whatsapp_url"
                name="whatsapp_url"
                value={contactInfo.whatsapp_url || ""}
                onChange={handleChange}
                placeholder="https://wa.me/your-number"
              />
              <p className="text-sm text-green-500 mt-1">
                Format: https://wa.me/911234567890 (include country code without +)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Button
        type="submit"
        className="w-full bg-green-700 hover:bg-green-800 text-white"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Contact Information"}
      </Button>
    </form>
  );
};

export default ContactInfoEditor;
