
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SideNavAdmin from "@/components/admin/SideNavAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Plus, Pencil, Trash, FileText, Image } from "lucide-react";

interface PlantCareGuide {
  id: string;
  title: string;
  content: string;
  cover_image: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const PlantCareGuidesAdmin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [guides, setGuides] = useState<PlantCareGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<PlantCareGuide | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    cover_image: "",
    category: "indoor",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    fetchGuides();
  }, [currentUser]);

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
      toast.error("Failed to load plant care guides");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      cover_image: "",
      category: "indoor",
    });
    setEditing(null);
  };

  const openEditDialog = (guide: PlantCareGuide) => {
    setEditing(guide);
    setFormData({
      title: guide.title,
      content: guide.content,
      cover_image: guide.cover_image,
      category: guide.category,
    });
    setShowDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }
    
    try {
      setSaving(true);
      
      if (editing) {
        // Update existing guide
        const { error } = await supabase
          .from('plant_care_guides')
          .update({
            title: formData.title,
            content: formData.content,
            cover_image: formData.cover_image,
            category: formData.category,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editing.id);
        
        if (error) throw error;
        
        toast.success("Guide updated successfully");
      } else {
        // Create new guide
        const { error } = await supabase
          .from('plant_care_guides')
          .insert({
            title: formData.title,
            content: formData.content,
            cover_image: formData.cover_image,
            category: formData.category,
          });
        
        if (error) throw error;
        
        toast.success("Guide created successfully");
      }
      
      // Refresh guide list
      fetchGuides();
      setShowDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error saving guide:", error);
      toast.error("Failed to save guide");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guide?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('plant_care_guides')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setGuides(guides.filter(guide => guide.id !== id));
      toast.success("Guide deleted successfully");
    } catch (error) {
      console.error("Error deleting guide:", error);
      toast.error("Failed to delete guide");
    }
  };

  const filteredGuides = guides.filter(guide => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      guide.title.toLowerCase().includes(search) ||
      guide.category.toLowerCase().includes(search) ||
      guide.content.toLowerCase().includes(search)
    );
  });

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavAdmin />
      
      <div className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-green-300">Plant Care Guides</h1>
              <p className="text-green-400">Manage plant care guides displayed on your website</p>
            </div>
            
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-800 hover:bg-green-700 text-green-300">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black border-green-900/50 text-green-300 sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editing ? "Edit Guide" : "Add New Guide"}</DialogTitle>
                  <DialogDescription className="text-green-400">
                    {editing 
                      ? "Update the information for this plant care guide." 
                      : "Create a new plant care guide to help your customers."}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-green-300">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="How to Care for Monstera Plants"
                      className="bg-black/40 border-green-900/50 text-green-300"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-green-300">Category</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border-green-900/50 text-green-300 p-2 rounded-md"
                    >
                      <option value="indoor">Indoor Plants</option>
                      <option value="outdoor">Outdoor Plants</option>
                      <option value="succulents">Succulents</option>
                      <option value="watering">Watering Tips</option>
                      <option value="general">General Care</option>
                      <option value="seasonal">Seasonal Care</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cover_image" className="text-green-300">Cover Image URL</Label>
                    <Input
                      id="cover_image"
                      name="cover_image"
                      value={formData.cover_image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="bg-black/40 border-green-900/50 text-green-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-green-300">Content (HTML supported)</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="<h3>Watering</h3><p>Water your monstera when the top inch of soil is dry...</p>"
                      rows={10}
                      className="bg-black/40 border-green-900/50 text-green-300 font-mono text-sm"
                      required
                    />
                    <p className="text-xs text-green-400">
                      Use HTML tags for formatting. E.g., &lt;h3&gt;Title&lt;/h3&gt;, &lt;p&gt;Paragraph&lt;/p&gt;, &lt;ul&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ul&gt;
                    </p>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowDialog(false);
                        resetForm();
                      }}
                      className="border-green-900/50 text-green-300 hover:bg-green-900/20"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="bg-green-800 hover:bg-green-700 text-green-300"
                    >
                      {saving ? "Saving..." : editing ? "Update Guide" : "Create Guide"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card className="bg-black/40 border-green-900/30 shadow-md">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-green-300">Published Guides</CardTitle>
                <Input
                  placeholder="Search guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm bg-black/40 border-green-900/50 text-green-300"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-green-400">Loading guides...</p>
                </div>
              ) : filteredGuides.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-green-900/50" />
                  <h3 className="mt-2 text-lg font-medium text-green-300">No guides found</h3>
                  <p className="mt-1 text-green-400">
                    {searchTerm 
                      ? "Try adjusting your search term" 
                      : "Get started by adding your first plant care guide"}
                  </p>
                  {!searchTerm && (
                    <Button 
                      className="mt-4 bg-green-800 hover:bg-green-700 text-green-300"
                      onClick={() => setShowDialog(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Guide
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGuides.map((guide) => (
                    <Card key={guide.id} className="bg-black/60 border-green-900/50 shadow-md hover:border-green-700/50 transition-colors">
                      <div className="h-40 overflow-hidden relative">
                        {guide.cover_image ? (
                          <img 
                            src={guide.cover_image} 
                            alt={guide.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-green-900/20 flex items-center justify-center">
                            <Image className="h-12 w-12 text-green-900/40" />
                          </div>
                        )}
                        <Badge className="absolute top-2 right-2 bg-green-800/90 hover:bg-green-800">
                          {guide.category}
                        </Badge>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-green-300 text-lg line-clamp-1">{guide.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-green-400 text-sm mb-4 line-clamp-2">
                          {guide.content.replace(/<[^>]*>/g, ' ').substring(0, 120)}...
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-green-500">
                            {new Date(guide.updated_at || guide.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 border-green-900/50 text-green-300 hover:bg-green-900/20"
                              onClick={() => openEditDialog(guide)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 border-red-900/50 text-red-300 hover:bg-red-900/20"
                              onClick={() => handleDelete(guide.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlantCareGuidesAdmin;
