
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  buttonText?: string;
  loading?: boolean;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
  onUploadComplete?: (url: string) => void;
  currentImage?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  buttonText = "Upload File",
  loading = false,
  className = "",
  accept = "*",
  maxSizeMB = 2,
  onUploadComplete,
  currentImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (maxSizeMB && fileSizeMB > maxSizeMB) {
      toast.error(`File size exceeds the maximum limit of ${maxSizeMB}MB.`);
      return;
    }
    
    try {
      await onUpload(file);
      if (onUploadComplete) {
        // This is just a placeholder, the actual URL would be returned from the onUpload function
        // However we're maintaining the API to match existing code
        onUploadComplete("");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept={accept}
      />
      <Button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={className}
      >
        {buttonText}
      </Button>
      {currentImage && (
        <div className="mt-2">
          <img src={currentImage} alt="Current image" className="w-20 h-20 object-cover rounded" />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
