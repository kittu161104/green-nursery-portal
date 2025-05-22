import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import SideNavAdmin from "@/components/admin/SideNavAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Leaf, Plus, Pencil, Trash2, Search } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";

interface PlantCareGuide {
  id: string;
  title: string;
  content: string;
  cover_image: string | null;
  category: string;
  created_at: string;
  updated_at: string | null;
}

const PlantCareGuidesAdmin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [guides, setGuides] = useState<PlantCareGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGuide, setEditingGuide] = useState<PlantCareGuide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("indoor");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/signin");
    } else {
      fetchGuides();
    }
  }, [currentUser, navigate]);

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
      
      setGuides(data as PlantCareGuide[] || []);
    } catch (error) {
      console.error("Error fetching plant care guides:", error);
      toast.error("Failed to load plant care guides");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (guide: PlantCareGuide) => {
    setEditingGuide(guide);
    setTitle(guide.title);
    setContent(guide.content);
    setCategory(guide.category);
    setCoverImage(guide.cover_image);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingGuide(null);
    setTitle("");
    setContent("");
    setCategory("indoor");
    setCoverImage(null);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingGuide(null);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setSaving(true);
      
      const guideData = {
        title,
        content,
        category,
        cover_image: coverImage,
        updated_at: new Date().toISOString()
      };
      
      if (editingGuide) {
        const { error } = await supabase
          .from('plant_care_guides')
          .update(guideData)
          .eq('id', editingGuide.id);
          
        if (error) throw error;
        toast.success("Guide updated successfully");
      } else {
        const { error } = await supabase
          .from('plant_care_guides')
          .insert([{
            ...guideData,
            created_at: new Date().toISOString()
          }]);
          
        if (error) throw error;
        toast.success("Guide created successfully");
      }
      
      fetchGuides();
      handleCancel();
    } catch (error) {
      console.error("Error saving guide:", error);
      toast.error("Failed to save guide");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this guide?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('plant_care_guides')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Guide deleted successfully");
      fetchGuides();
    } catch (error) {
      console.error("Error deleting guide:", error);
      toast.error("Failed to delete guide");
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `plant-guides/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('plant-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('plant-images')
        .getPublicUrl(filePath);
        
      setCoverImage(data.publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const filteredGuides = guides.filter(guide => 
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryDisplayName = (categoryCode: string) => {
    switch (categoryCode) {
      case "indoor": return "Indoor Plants";
      case "outdoor": return "Outdoor Plants";
      case "succulents": return "Succulents";
      case "watering": return "Watering Tips";
      case "general": return "General Care";
      case "seasonal": return "Seasonal Care";
      default: return categoryCode.charAt(0).toUpperCase() + categoryCode.slice(1);
    }
  };

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
              <p className="text-green-500">Manage plant care guides and articles</p>
            </div>
            
            {!isCreating && !editingGuide && (
              <Button 
                onClick={handleCreate} 
                className="bg-green-700 hover:bg-green-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Create New Guide
              </Button>
            )}
          </div>
          
          {(isCreating || editingGuide) ? (
            <Card className="bg-black/40 border-green-900/30">
              <CardHeader>
                <CardTitle className="text-green-300">
                  {isCreating ? "Create New Guide" : "Edit Guide"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-green-300 mb-1">Title</label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-black/40 border-green-900/50 text-green-200"
                      placeholder="Guide Title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-green-300 mb-1">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-black/40 border-green-900/50 text-green-300">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-green-900/50 text-green-300">
                        <SelectItem value="indoor">Indoor Plants</SelectItem>
                        <SelectItem value="outdoor">Outdoor Plants</SelectItem>
                        <SelectItem value="succulents">Succulents</SelectItem>
                        <SelectItem value="watering">Watering Tips</SelectItem>
                        <SelectItem value="general">General Care</SelectItem>
                        <SelectItem value="seasonal">Seasonal Care</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="content" className="block text-green-300 mb-1">Content (HTML)</label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px] bg-black/40 border-green-900/50 text-green-200"
                      placeholder="<p>Your guide content here...</p>"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-green-300 mb-2">Cover Image</label>
                    <FileUpload
                      onUpload={handleImageUpload}
                      buttonText="Upload Cover Image"
                      loading={saving}
                      className="bg-green-900 hover:bg-green-800 text-white"
                      acceptedFileTypes="image/*"
                      maxSizeInMB={5}
                      currentImage={coverImage || undefined}
                    />
                  </div>
                  
                  <div className="flex gap-4 justify-end">
                    <Button 
                      type="button" 
                      onClick={handleCancel}
                      variant="outline"
                      className="border-green-900/50 text-green-300 hover:bg-green-900/20"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={saving}
                      className="bg-green-700 hover:bg-green-600 text-white"
                    >
                      {saving ? "Saving..." : "Save Guide"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
                  <Input 
                    placeholder="Search guides..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/40 border-green-900/50 text-green-300"
                  />
                </div>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="bg-black/40 border-green-900/30 animate-pulse">
                      <div className="h-40 bg-green-900/20 rounded-t-lg"></div>
                      <CardContent className="p-4">
                        <div className="h-6 bg-green-900/30 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-green-900/20 rounded mb-1"></div>
                        <div className="h-4 bg-green-900/20 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredGuides.length === 0 ? (
                <Card className="bg-black/40 border-green-900/30 p-8 text-center">
                  <Leaf className="mx-auto h-12 w-12 text-green-700/50 mb-4" />
                  <h3 className="text-xl font-medium text-green-300 mb-2">No guides found</h3>
                  <p className="text-green-400 mb-4">
                    {searchTerm 
                      ? `No guides matching "${searchTerm}"` 
                      : "No plant care guides have been created yet."}
                  </p>
                  {searchTerm && (
                    <Button 
                      onClick={() => setSearchTerm("")}
                      className="bg-green-800 hover:bg-green-700 text-green-300"
                    >
                      Clear Search
                    </Button>
                  )}
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredGuides.map(guide => (
                    <Card key={guide.id} className="bg-black/40 border-green-900/30 overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        {guide.cover_image ? (
                          <img 
                            src={guide.cover_image} 
                            alt={guide.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-green-900/20 flex items-center justify-center">
                            <Leaf className="h-12 w-12 text-green-700/50" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-medium text-green-300">{guide.title}</h3>
                          <Badge className="bg-green-800 text-xs">
                            {getCategoryDisplayName(guide.category)}
                          </Badge>
                        </div>
                        <p className="text-green-400 text-sm mb-4 line-clamp-2">
                          {guide.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-green-500">
                            {new Date(guide.updated_at || guide.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEdit(guide)}
                              className="border-green-900/50 text-green-300 hover:bg-green-900/20"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDelete(guide.id)}
                              className="border-red-900/50 text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantCareGuidesAdmin;
