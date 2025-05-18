
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AboutInfo {
  title: string;
  content: string;
  mission_statement: string;
  vision: string;
  history: string;
}

const About = () => {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>({
    title: "About Natural Green Nursery",
    content: "Your trusted source for beautiful and healthy plants.",
    mission_statement: "Our mission is to bring nature into every home and office, making green living accessible to all.",
    vision: "We envision a greener world where plants are an essential part of everyday living.",
    history: "Founded in 2020, Natural Green Nursery started as a small family business with a passion for plants."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('about_info')
          .select('*')
          .single();

        if (error) {
          console.error("Error fetching about info:", error);
        } else if (data) {
          setAboutInfo(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutInfo();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-grow">
        <div className="relative py-16">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
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
              <h1 className="text-4xl font-bold text-green-300 text-center mb-8">{aboutInfo.title}</h1>
              
              <div className="glass-card max-w-3xl mx-auto p-8 rounded-xl shadow-2xl mb-12">
                <p className="text-green-200 text-lg mb-6">{aboutInfo.content}</p>
                
                <h2 className="text-2xl font-bold text-green-300 mb-4">Our Mission</h2>
                <p className="text-green-200 mb-6">{aboutInfo.mission_statement}</p>
                
                <h2 className="text-2xl font-bold text-green-300 mb-4">Our Vision</h2>
                <p className="text-green-200 mb-6">{aboutInfo.vision}</p>
              </div>
              
              <div className="glass-card max-w-3xl mx-auto p-8 rounded-xl shadow-2xl">
                <h2 className="text-2xl font-bold text-green-300 mb-4">Our History</h2>
                <div className="text-green-200 prose prose-invert"
                  dangerouslySetInnerHTML={{ __html: aboutInfo.history }}
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

export default About;
