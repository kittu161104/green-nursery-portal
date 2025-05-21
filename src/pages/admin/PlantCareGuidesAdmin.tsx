
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SideNavAdmin from "@/components/admin/SideNavAdmin";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Search, Plus, Pencil, Trash2, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PlantCareGuide {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  plant_type: string;
  author_id?: string;
  image_url?: string;
}

const PlantCareGuidesAdmin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [guides, setGuides] = useState<PlantCareGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [currentGuide, setCurrentGuide] = useState<PlantCareGuide | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formPlantType, setFormPlantType] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchGuides = async () => {
      // In a real app, fetch from Supabase
      setGuides([
        {
          id: "1",
          title: "Monstera Deliciosa Care Guide",
          plant_type: "Tropical",
          content: "Monstera plants thrive in bright, indirect light. Water when the top inch of soil is dry. Keep in a humid environment and fertilize monthly during growing season.",
          created_at: "2025-05-01T10:00:00Z",
          updated_at: "2025-05-01T10:00:00Z",
          image_url: "https://images.unsplash.com/photo-1601069925161-6dd5313de5a2?w=800&auto=format&fit=crop&q=60"
        },
        {
          id: "2",
          title: "Succulents Care Guide",
          plant_type: "Desert",
          content: "Succulents need bright light, well-draining soil, and infrequent watering. Let soil dry out completely between waterings. Use cactus soil mix for best results.",
          created_at: "2025-05-02T10:00:00Z",
          updated_at: "2025-05-02T10:00:00Z",
          image_url: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&auto=format&fit=crop&q=60"
        },
        {
          id: "3",
          title: "Fern Care Guide",
          plant_type: "Shade",
          content: "Ferns prefer indirect light and consistent moisture. Keep soil evenly moist and provide high humidity. Avoid direct sunlight which can burn the delicate fronds.",
          created_at: "2025-05-03T10:00:00Z",
          updated_at: "2025-05-03T10:00:00Z",
          image_url: "https://images.unsplash.com/photo-1600411833114-683d8d825a67?w=800&auto=format&fit=crop&q=60"
        }
      ]);
      setLoading(false);
    };

    fetchGuides();
  }, []);
  
  const handleAddNewGuide = () => {
    setCurrentGuide(null);
    setFormTitle("");
    setFormContent("");
    setFormPlantType("");
    setFormImageUrl("");
    setEditDialogOpen(true);
  };
  
  const handleEditGuide = (guide: PlantCareGuide) => {
    setCurrentGuide(guide);
    setFormTitle(guide.title);
    setFormContent(guide.content);
    setFormPlantType(guide.plant_type);
    setFormImageUrl(guide.image_url || "");
    setEditDialogOpen(true);
  };
  
  const handleDeleteGuide = (guide: PlantCareGuide) => {
    setCurrentGuide(guide);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteGuide = () => {
    if (!currentGuide) return;
    
    // Filter out the deleted guide
    setGuides(guides.filter(g => g.id !== currentGuide.id));
    setDeleteDialogOpen(false);
    toast.success(`"${currentGuide.title}" has been deleted.`);
  };
  
  const handleSubmitGuide = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formTitle.trim() || !formContent.trim() || !formPlantType.trim()) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }
    
    setTimeout(() => {
      if (currentGuide) {
        // Update existing guide
        const updatedGuide = {
          ...currentGuide,
          title: formTitle,
          content: formContent,
          plant_type: formPlantType,
          image_url: formImageUrl,
          updated_at: new Date().toISOString()
        };
        
        setGuides(guides.map(g => g.id === currentGuide.id ? updatedGuide : g));
        toast.success(`"${formTitle}" has been updated.`);
      } else {
        // Create new guide
        const newGuide: PlantCareGuide = {
          id: `temp-${Date.now()}`,
          title: formTitle,
          content: formContent,
          plant_type: formPlantType,
          image_url: formImageUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author_id: currentUser?.id
        };
        
        setGuides([...guides, newGuide]);
        toast.success(`"${formTitle}" has been created.`);
      }
      
      setIsSubmitting(false);
      setEditDialogOpen(false);
    }, 800);
  };
  
  const filteredGuides = guides.filter(guide => 
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.plant_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-black">
      <SideNavAdmin />
      
      <div className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-green-300">Plant Care Guides</h1>
              <p className="text-green-500">Manage plant care information for your customers</p>
            </div>
            
            <Button 
              onClick={handleAddNewGuide} 
              className="bg-green-800 hover:bg-green-700 text-green-300"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Guide
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
            <Input 
              placeholder="Search guides..." 
              className="pl-10 bg-black/40 border-green-900/50 text-green-300 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Card className="bg-black/40 border-green-900/30">
            <CardHeader>
              <CardTitle className="text-green-300 flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                Plant Care Guides
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-green-900/20 rounded"></div>
                  ))}
                </div>
              ) : filteredGuides.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-green-900/30 hover:bg-green-900/10">
                        <TableHead className="text-green-400">Title</TableHead>
                        <TableHead className="text-green-400">Plant Type</TableHead>
                        <TableHead className="text-green-400">Last Updated</TableHead>
                        <TableHead className="text-green-400 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGuides.map((guide) => (
                        <TableRow 
                          key={guide.id} 
                          className="border-green-900/30 hover:bg-green-900/10"
                        >
                          <TableCell className="text-green-300 font-medium">
                            <div className="flex items-center gap-2">
                              {guide.image_url ? (
                                <img 
                                  src={guide.image_url} 
                                  alt={guide.title} 
                                  className="w-10 h-10 rounded-md object-cover" 
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-md bg-green-900/30 flex items-center justify-center">
                                  <Leaf className="w-5 h-5 text-green-500" />
                                </div>
                              )}
                              {guide.title}
                            </div>
                          </TableCell>
                          <TableCell className="text-green-300">{guide.plant_type}</TableCell>
                          <TableCell className="text-green-300">{formatDate(guide.updated_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-green-500 hover:text-green-300 hover:bg-green-900/30"
                                onClick={() => handleEditGuide(guide)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-300 hover:bg-red-900/30"
                                onClick={() => handleDeleteGuide(guide)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-8 text-green-400">
                  No plant care guides found matching your search criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Edit/Add Guide Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-black/90 border-green-900/30">
          <DialogHeader>
            <DialogTitle className="text-green-300">
              {currentGuide ? "Edit Plant Care Guide" : "Add New Plant Care Guide"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitGuide} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guide-title" className="text-green-300">Title</Label>
              <Input
                id="guide-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., Monstera Deliciosa Care Guide"
                className="bg-black/40 border-green-900/50 text-green-300"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guide-plant-type" className="text-green-300">Plant Type</Label>
              <Input
                id="guide-plant-type"
                value={formPlantType}
                onChange={(e) => setFormPlantType(e.target.value)}
                placeholder="e.g., Tropical, Succulent, Herb"
                className="bg-black/40 border-green-900/50 text-green-300"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guide-content" className="text-green-300">Care Instructions</Label>
              <Textarea
                id="guide-content"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Provide detailed care instructions for this plant..."
                className="bg-black/40 border-green-900/50 text-green-300 min-h-[200px]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guide-image" className="text-green-300">Image URL (optional)</Label>
              <Input
                id="guide-image"
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="bg-black/40 border-green-900/50 text-green-300"
              />
              {formImageUrl && (
                <div className="mt-2 border border-green-900/30 rounded-md p-2 max-w-xs">
                  <img 
                    src={formImageUrl}
                    alt="Preview"
                    className="rounded-md w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditDialogOpen(false)}
                className="border-green-900/30 text-green-400"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-green-800 hover:bg-green-700 text-green-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : currentGuide ? 'Update Guide' : 'Create Guide'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md bg-black/90 border-green-900/30">
          <DialogHeader>
            <DialogTitle className="text-red-400">Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <p className="text-green-300">
            Are you sure you want to delete "{currentGuide?.title}"? This action cannot be undone.
          </p>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="border-green-900/30 text-green-400"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-red-800 hover:bg-red-700 text-red-300"
              onClick={confirmDeleteGuide}
            >
              Delete Guide
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlantCareGuidesAdmin;
