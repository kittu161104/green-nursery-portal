
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PlantCareGuides = () => {
  const guides = [
    {
      id: 1,
      title: "Simple Watering Guidelines",
      description: "Learn when and how much to water your plants.",
      content: "Different plants require different watering schedules. Some plants prefer to dry out between waterings, while others prefer consistently moist soil. Check the soil moisture by sticking your finger about an inch into the soil. If it feels dry, it's time to water. Water thoroughly until water drains from the bottom of the pot. Empty any water that collects in the saucer to prevent root rot.",
      image: "https://images.unsplash.com/photo-1562517634-8cf2fd7a3aff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      title: "Light Requirement Indicators",
      description: "Where to place your plant for optimal growth.",
      content: "Plants have different light requirements. High light plants need at least 6 hours of direct sunlight daily and should be placed near south or west-facing windows. Medium light plants thrive in bright, indirect light, which can be found near east-facing windows or a few feet away from south or west-facing windows. Low light plants can survive in north-facing windows or areas away from windows with ambient light.",
      image: "https://images.unsplash.com/photo-1508022713622-df2d8fb7b4cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      title: "Seasonal Care Tips",
      description: "Adjust your care routine as seasons change.",
      content: "In spring and summer (growing season), increase watering frequency and begin fertilizing. Most plants appreciate being moved outdoors during warm months but acclimatize them gradually to prevent shock. In fall and winter, reduce watering as plant growth slows. Move plants away from cold drafts and heaters. Most plants don't need fertilizer during dormancy. Increase humidity with a humidifier or pebble tray during dry winter months.",
      image: "https://images.unsplash.com/photo-1518531933034-3b0d282b4511?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-grow">
        <div className="relative py-16">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1554631221-f9603e6808be?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              alt="Plants background"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-green-950/40 to-black/90 backdrop-blur-sm"></div>
          </div>

          <div className="container mx-auto px-6 py-12 relative z-10">
            <h1 className="text-4xl font-bold text-green-300 text-center mb-12">Plant Care Guides</h1>
            
            <div className="space-y-16 max-w-5xl mx-auto">
              {guides.map((guide) => (
                <Card key={guide.id} className="glass-card overflow-hidden border-green-900/30">
                  <div className="md:grid md:grid-cols-3 md:gap-8">
                    <div className="md:col-span-1">
                      <div className="h-48 md:h-full overflow-hidden">
                        <img 
                          src={guide.image} 
                          alt={guide.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-green-300 text-2xl">{guide.title}</CardTitle>
                        <CardDescription className="text-green-400">{guide.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-green-200">{guide.content}</p>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlantCareGuides;
