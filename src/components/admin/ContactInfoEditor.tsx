
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FileUpload from "./FileUpload";

interface ContactInfo {
  id?: string;
  address_line1: string;
  address_line2: string;
  phone: string;
  email: string;
  facebook_url?: string;
  instagram_url?: string;
  whatsapp_url?: string;
  map_image_url?: string;
}

const ContactInfoEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address_line1: "",
    address_line2: "",
    phone: "",
    email: "",
    facebook_url: "",
    instagram_url: "",
    whatsapp_url: "",
    map_image_url: ""
  });
  const [uploadingMap, setUploadingMap] = useState(false);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_info')
          .select("*")
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setContactInfo(data);
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
        toast.error("Failed to load contact information");
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

  const handleMapImageUpload = async (file: File) => {
    if (!file) return;
    
    try {
      setUploadingMap(true);
      
      // Upload to Storage
      const fileName = `map_${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('contact-images')
        .upload(fileName, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('contact-images')
        .getPublicUrl(fileName);
      
      // Update contact info with new image URL
      setContactInfo(prev => ({ ...prev, map_image_url: publicUrl }));
      
      toast.success("Map image uploaded successfully");
    } catch (error) {
      console.error("Error uploading map image:", error);
      toast.error("Failed to upload map image");
    } finally {
      setUploadingMap(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('contact_info')
        .upsert(
          { 
            ...contactInfo,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'id' }
        );
      
      if (error) {
        throw error;
      }
      
      toast.success("Contact information saved successfully");
    } catch (error) {
      console.error("Error saving contact info:", error);
      toast.error("Failed to save contact information");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-black/40 border-green-900/30">
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-green-900/30 rounded"></div>
            <div className="h-4 bg-green-900/30 rounded w-5/6"></div>
            <div className="h-4 bg-green-900/30 rounded"></div>
            <div className="h-4 bg-green-900/30 rounded w-4/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-black/40 border-green-900/30">
        <CardHeader>
          <CardTitle className="text-green-300">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address_line1" className="text-green-300">Address Line 1</Label>
            <Input
              id="address_line1"
              name="address_line1"
              value={contactInfo.address_line1}
              onChange={handleChange}
              className="bg-black/40 border-green-900/50 text-green-300"
              placeholder="123 Green Street"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address_line2" className="text-green-300">Address Line 2</Label>
            <Input
              id="address_line2"
              name="address_line2"
              value={contactInfo.address_line2}
              onChange={handleChange}
              className="bg-black/40 border-green-900/50 text-green-300"
              placeholder="City, State, Postal Code"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-green-300">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={contactInfo.phone}
              onChange={handleChange}
              className="bg-black/40 border-green-900/50 text-green-300"
              placeholder="+91 123 456 7890"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-green-300">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={contactInfo.email}
              onChange={handleChange}
              className="bg-black/40 border-green-900/50 text-green-300"
              placeholder="contact@naturalgreenursery.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="facebook_url" className="text-green-300">Facebook URL (Optional)</Label>
            <Input
              id="facebook_url"
              name="facebook_url"
              value={contactInfo.facebook_url || ""}
              onChange={handleChange}
              className="bg-black/40 border-green-900/50 text-green-300"
              placeholder="https://facebook.com/naturalgreenursery"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instagram_url" className="text-green-300">Instagram URL (Optional)</Label>
            <Input
              id="instagram_url"
              name="instagram_url"
              value={contactInfo.instagram_url || ""}
              onChange={handleChange}
              className="bg-black/40 border-green-900/50 text-green-300"
              placeholder="https://instagram.com/naturalgreenursery"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp_url" className="text-green-300">WhatsApp URL (Optional)</Label>
            <Input
              id="whatsapp_url"
              name="whatsapp_url"
              value={contactInfo.whatsapp_url || ""}
              onChange={handleChange}
              className="bg-black/40 border-green-900/50 text-green-300"
              placeholder="https://wa.me/911234567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="map_image" className="text-green-300">Location Map Image</Label>
            <div className="mt-2 flex flex-col space-y-4">
              {contactInfo.map_image_url && (
                <div className="relative border border-green-900/30 rounded-md overflow-hidden h-60">
                  <img 
                    src={contactInfo.map_image_url} 
                    alt="Location Map" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <FileUpload
                onUpload={handleMapImageUpload}
                buttonText={uploadingMap ? "Uploading..." : "Upload Map Image"}
                loading={uploadingMap}
                className="bg-green-800 hover:bg-green-700 text-green-300"
                acceptedFileTypes="image/*"
                maxSizeInMB={5}
              />
              <p className="text-sm text-green-400">
                Upload a screenshot or image of your location from Google Maps or similar service.
                Maximum file size: 5MB. Recommended dimensions: 800x600 pixels.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="bg-green-800 hover:bg-green-700 text-green-300" 
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ContactInfoEditor;
