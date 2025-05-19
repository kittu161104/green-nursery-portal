
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
}

const FileUpload = ({ onUploadComplete, currentImage }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the file
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      if (data && data.publicUrl) {
        setPreview(data.publicUrl);
        onUploadComplete(data.publicUrl);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        // Display preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        
        await uploadFile(file);
        
        // Clean up the object URL
        URL.revokeObjectURL(objectUrl);
      }
    }
  });

  const handleReset = () => {
    setPreview(null);
    onUploadComplete("");
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? "border-green-400 bg-green-900/20" 
              : "border-green-700 hover:border-green-600"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <p className="text-green-300 font-medium">
            {isDragActive 
              ? "Drop the image here" 
              : "Drag & drop an image here, or click to select"
            }
          </p>
          <p className="text-green-500 text-sm mt-2">
            Accepted formats: JPEG, PNG, WebP
          </p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-green-700">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-64 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleReset}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {uploading && (
        <div className="w-full bg-green-900/20 rounded-full h-2.5">
          <div className="bg-green-500 h-2.5 rounded-full animate-pulse" style={{ width: "100%" }}></div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
