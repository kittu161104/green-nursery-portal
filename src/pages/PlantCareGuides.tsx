
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Search, Leaf, Calendar } from "lucide-react";

interface PlantCareGuide {
  id: string;
  title: string;
  content: string;
  cover_image: string | null;
  category: string;
  created_at: string;
  updated_at: string | null;
}

const PlantCareGuides = () => {
  const [guides, setGuides] = useState<PlantCareGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<PlantCareGuide | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('plant_care_guides')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setGuides(data || []);
      } catch (error) {
        console.error("Error fetching plant care guides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
    
    // Listen for changes to the plant_care_guides table
    const channel = supabase
      .channel('plant_care_guides_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'plant_care_guides' 
      }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          // Add or update the guide in our state
          setGuides(prevGuides => {
            const existingIndex = prevGuides.findIndex(g => g.id === payload.new.id);
            if (existingIndex >= 0) {
              // Update existing guide
              const updatedGuides = [...prevGuides];
              updatedGuides[existingIndex] = payload.new as PlantCareGuide;
              return updatedGuides;
            } else {
              // Add new guide
              return [payload.new as PlantCareGuide, ...prevGuides];
            }
          });
        } else if (payload.eventType === 'DELETE') {
          // Remove the guide from our state
          setGuides(prevGuides => prevGuides.filter(g => g.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case "indoor": return "Indoor Plants";
      case "outdoor": return "Outdoor Plants";
      case "succulents": return "Succulents";
      case "watering": return "Watering Tips";
      case "general": return "General Care";
      case "seasonal": return "Seasonal Care";
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const getUniqueCategoriesWithCounts = () => {
    const categories = guides.reduce((acc, guide) => {
      acc[guide.category] = (acc[guide.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array of objects for easier mapping
    return Object.entries(categories).map(([category, count]) => ({
      category,
      displayName: getCategoryDisplayName(category),
      count
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the filtered guides
  };

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = !searchTerm || 
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || guide.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

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

          <div className="container mx-auto px-6 py-12 relative z-10">
            <h1 className="text-4xl font-bold text-green-300 text-center mb-2">Plant Care Guides</h1>
            <p className="text-xl text-green-400 text-center mb-8">
              Expert tips to help your plants thrive
            </p>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="w-full lg:w-64 space-y-6">
                {/* Search */}
                <div className="glass-card p-4 rounded-lg border border-green-900/30">
                  <h3 className="text-lg font-medium mb-3 text-green-300">Search Guides</h3>
                  <form onSubmit={handleSearch} className="flex">
                    <Input
                      type="text"
                      placeholder="Search guides..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded-r-none bg-black/40 border-green-900/50 text-green-300 placeholder:text-green-700"
                    />
                    <Button
                      type="submit"
                      className="rounded-l-none bg-green-800 hover:bg-green-700 text-green-300"
                    >
                      <Search size={18} />
                    </Button>
                  </form>
                </div>
                
                {/* Categories */}
                <div className="glass-card p-4 rounded-lg border border-green-900/30">
                  <h3 className="text-lg font-medium mb-3 text-green-300">Categories</h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        className={`text-left w-full py-1 px-2 rounded transition-colors ${
                          activeCategory === "all"
                            ? "bg-green-900/50 text-green-300 font-medium"
                            : "hover:bg-green-900/20 text-green-400"
                        }`}
                        onClick={() => setActiveCategory("all")}
                      >
                        All Guides ({guides.length})
                      </button>
                    </li>
                    {getUniqueCategoriesWithCounts().map(({ category, displayName, count }) => (
                      <li key={category}>
                        <button
                          className={`text-left w-full py-1 px-2 rounded transition-colors ${
                            activeCategory === category
                              ? "bg-green-900/50 text-green-300 font-medium"
                              : "hover:bg-green-900/20 text-green-400"
                          }`}
                          onClick={() => setActiveCategory(category)}
                        >
                          {displayName} ({count})
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((_, i) => (
                      <div key={i} className="glass-card rounded-lg animate-pulse">
                        <div className="h-40 bg-green-900/20 rounded-t-lg"></div>
                        <div className="p-4 space-y-2">
                          <div className="h-6 bg-green-900/30 rounded w-3/4"></div>
                          <div className="h-4 bg-green-900/20 rounded"></div>
                          <div className="h-4 bg-green-900/20 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredGuides.length === 0 ? (
                  <div className="glass-card p-8 rounded-lg text-center">
                    <Leaf className="mx-auto h-12 w-12 text-green-700/50 mb-4" />
                    <h3 className="text-xl font-medium text-green-300 mb-2">No guides found</h3>
                    <p className="text-green-400 mb-4">
                      {searchTerm 
                        ? `No guides matching "${searchTerm}" in the selected category.` 
                        : "No plant care guides available in this category yet."}
                    </p>
                    {searchTerm && (
                      <Button 
                        onClick={() => setSearchTerm("")}
                        className="bg-green-800 hover:bg-green-700 text-green-300"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    {selectedGuide ? (
                      <div className="glass-card p-6 rounded-lg">
                        <div className="mb-4 flex justify-between items-center">
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedGuide(null)}
                            className="border-green-900/50 text-green-300 hover:bg-green-900/20"
                          >
                            ← Back to Guides
                          </Button>
                          <Badge className="bg-green-800/90 hover:bg-green-800">
                            {getCategoryDisplayName(selectedGuide.category)}
                          </Badge>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-green-300 mb-4">{selectedGuide.title}</h2>
                        
                        {selectedGuide.cover_image && (
                          <div className="mb-6">
                            <img 
                              src={selectedGuide.cover_image} 
                              alt={selectedGuide.title}
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center text-green-400 text-sm mb-6">
                          <Calendar className="h-4 w-4 mr-1" />
                          Last updated: {new Date(selectedGuide.updated_at || selectedGuide.created_at).toLocaleDateString()}
                        </div>
                        
                        <div 
                          className="prose prose-invert max-w-none text-green-300 prose-headings:text-green-200 prose-strong:text-green-200 prose-a:text-green-400 prose-ul:text-green-300"
                          dangerouslySetInnerHTML={{ __html: selectedGuide.content }}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredGuides.map(guide => (
                          <Card key={guide.id} className="bg-black/40 border-green-900/30 hover:border-green-700/50 transition-all duration-300 overflow-hidden">
                            <div className="h-40 overflow-hidden">
                              {guide.cover_image ? (
                                <img 
                                  src={guide.cover_image} 
                                  alt={guide.title}
                                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full bg-green-900/20 flex items-center justify-center">
                                  <Leaf className="h-12 w-12 text-green-700/50" />
                                </div>
                              )}
                            </div>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-green-300 text-lg">{guide.title}</CardTitle>
                                <Badge className="bg-green-800/90 hover:bg-green-800 text-xs">
                                  {getCategoryDisplayName(guide.category)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-green-400 text-sm line-clamp-2">
                                {guide.content.replace(/<[^>]*>/g, ' ').substring(0, 120)}...
                              </p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <span className="text-xs text-green-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(guide.updated_at || guide.created_at).toLocaleDateString()}
                              </span>
                              <Button 
                                onClick={() => setSelectedGuide(guide)}
                                className="bg-green-800 hover:bg-green-700 text-green-300"
                              >
                                Read Guide
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlantCareGuides;
