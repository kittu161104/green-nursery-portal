
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AboutInfo {
  id?: string;
  title: string;
  content: string;
  mission_statement: string;
  vision: string;
  history: string;
}

const AboutInfoEditor = () => {
  const [loading, setLoading] = useState(false);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>({
    title: "About Natural Green Nursery",
    content: "Your trusted source for beautiful and healthy plants.",
    mission_statement: "Our mission is to bring nature into every home and office, making green living accessible to all.",
    vision: "We envision a greener world where plants are an essential part of everyday living.",
    history: "Founded in 2020, Natural Green Nursery started as a small family business with a passion for plants."
  });

  useEffect(() => {
    fetchAboutInfo();
  }, []);

  const fetchAboutInfo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('about_info')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error("Error fetching about info:", error);
      } else if (data) {
        setAboutInfo(data as AboutInfo);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAboutInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (aboutInfo.id) {
        // Update existing record
        response = await supabase
          .from('about_info')
          .update({
            title: aboutInfo.title,
            content: aboutInfo.content,
            mission_statement: aboutInfo.mission_statement,
            vision: aboutInfo.vision,
            history: aboutInfo.history,
          })
          .eq("id", aboutInfo.id);
      } else {
        // Insert new record
        response = await supabase
          .from('about_info')
          .insert({
            title: aboutInfo.title,
            content: aboutInfo.content,
            mission_statement: aboutInfo.mission_statement,
            vision: aboutInfo.vision,
            history: aboutInfo.history,
          });
      }

      if (response.error) {
        toast.error("Failed to save about information");
        console.error("Error saving about info:", response.error);
      } else {
        toast.success("About information saved successfully");
        fetchAboutInfo(); // Refresh data
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black/40 shadow-lg border-green-900/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-green-300">About Page Information</CardTitle>
        <CardDescription className="text-green-500">
          Edit the about page content that appears on the website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-green-300">
              Page Title
            </label>
            <Input
              id="title"
              name="title"
              value={aboutInfo.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="bg-black/30 border-green-900/50 text-green-300 placeholder:text-green-700"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-green-300">
              Main Content
            </label>
            <Textarea
              id="content"
              name="content"
              value={aboutInfo.content}
              onChange={handleInputChange}
              placeholder="Main content"
              className="bg-black/30 border-green-900/50 text-green-300 placeholder:text-green-700 min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="mission_statement" className="text-sm font-medium text-green-300">
              Mission Statement
            </label>
            <Textarea
              id="mission_statement"
              name="mission_statement"
              value={aboutInfo.mission_statement}
              onChange={handleInputChange}
              placeholder="Mission statement"
              className="bg-black/30 border-green-900/50 text-green-300 placeholder:text-green-700"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="vision" className="text-sm font-medium text-green-300">
              Vision
            </label>
            <Textarea
              id="vision"
              name="vision"
              value={aboutInfo.vision}
              onChange={handleInputChange}
              placeholder="Vision"
              className="bg-black/30 border-green-900/50 text-green-300 placeholder:text-green-700"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="history" className="text-sm font-medium text-green-300">
              Company History
            </label>
            <Textarea
              id="history"
              name="history"
              value={aboutInfo.history}
              onChange={handleInputChange}
              placeholder="Company history"
              className="bg-black/30 border-green-900/50 text-green-300 placeholder:text-green-700 min-h-[200px]"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-900 hover:bg-green-800 text-green-300 border border-green-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save About Information"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AboutInfoEditor;
