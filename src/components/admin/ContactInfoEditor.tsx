
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ContactInfo {
  id?: string;
  address_line1: string;
  address_line2: string;
  phone: string;
  email: string;
}

const ContactInfoEditor = () => {
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address_line1: "",
    address_line2: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_info")
        .select("*")
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (contactInfo.id) {
        // Update existing record
        response = await supabase
          .from("contact_info")
          .update({
            address_line1: contactInfo.address_line1,
            address_line2: contactInfo.address_line2,
            phone: contactInfo.phone,
            email: contactInfo.email,
          })
          .eq("id", contactInfo.id);
      } else {
        // Insert new record
        response = await supabase
          .from("contact_info")
          .insert({
            address_line1: contactInfo.address_line1,
            address_line2: contactInfo.address_line2,
            phone: contactInfo.phone,
            email: contactInfo.email,
          });
      }

      if (response.error) {
        toast.error("Failed to save contact information");
        console.error("Error saving contact info:", response.error);
      } else {
        toast.success("Contact information saved successfully");
        fetchContactInfo(); // Refresh data
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card shadow-lg border-green-900/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-green-50">Contact Information</CardTitle>
        <CardDescription className="text-muted-foreground">
          Edit the contact information that appears in the website footer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="address_line1" className="text-sm font-medium text-green-100">
              Address Line 1
            </label>
            <Input
              id="address_line1"
              name="address_line1"
              value={contactInfo.address_line1}
              onChange={handleInputChange}
              placeholder="Street address"
              className="bg-secondary/50 border-green-900/50 text-green-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address_line2" className="text-sm font-medium text-green-100">
              Address Line 2
            </label>
            <Input
              id="address_line2"
              name="address_line2"
              value={contactInfo.address_line2}
              onChange={handleInputChange}
              placeholder="City, State, Zip"
              className="bg-secondary/50 border-green-900/50 text-green-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-green-100">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              value={contactInfo.phone}
              onChange={handleInputChange}
              placeholder="Phone number"
              className="bg-secondary/50 border-green-900/50 text-green-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-green-100">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={contactInfo.email}
              onChange={handleInputChange}
              placeholder="Email address"
              className="bg-secondary/50 border-green-900/50 text-green-50"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-700 hover:bg-green-800 text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Contact Information"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactInfoEditor;
