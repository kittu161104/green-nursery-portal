
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";

export interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  buttonText?: string;
  loading?: boolean;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  buttonText = "Upload File",
  loading = false,
  className = "",
  accept = "*",
  maxSizeMB = 2
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
      alert(`File size exceeds the maximum limit of ${maxSizeMB}MB.`);
      return;
    }
    
    try {
      await onUpload(file);
    } catch (error) {
      console.error("Error uploading file:", error);
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
    </div>
  );
};

export default FileUpload;
