
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export interface FileUploadProps {
  onUpload: (file: File) => void | Promise<void>;
  onUploadComplete?: (url: string) => void;
  buttonText?: string;
  loading?: boolean;
  className?: string;
  acceptedFileTypes?: string;
  maxSizeInMB?: number;
  currentImage?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  onUploadComplete,
  buttonText = 'Upload File',
  loading = false,
  className = '',
  acceptedFileTypes = 'image/*',
  maxSizeInMB = 5,
  currentImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file type if acceptedFileTypes is provided
    if (acceptedFileTypes && !file.type.match(acceptedFileTypes.replace('*', '.*'))) {
      setError(`Please select a valid file type (${acceptedFileTypes})`);
      return;
    }
    
    // Validate file size
    const maxSizeBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File is too large. Maximum size is ${maxSizeInMB}MB`);
      return;
    }
    
    try {
      await onUpload(file);
      
      // Reset the input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('An error occurred during upload');
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        className="hidden"
        disabled={loading}
      />
      <Button
        type="button"
        onClick={handleButtonClick}
        disabled={loading}
        className={className}
      >
        {buttonText}
      </Button>
      {currentImage && (
        <div className="mt-2">
          <img 
            src={currentImage} 
            alt="Uploaded image" 
            className="h-24 w-auto object-contain border border-green-500/30 rounded"
          />
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;
