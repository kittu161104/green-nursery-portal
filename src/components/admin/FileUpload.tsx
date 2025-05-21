import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

export interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  onUpload?: (file: File) => Promise<void>;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete, currentImage, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Create a preview URL for immediate display
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // If custom upload handler is provided, use it
      if (onUpload) {
        await onUpload(file);
      } else {
        // Otherwise simulate an upload with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        onUploadComplete(objectUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image');
      setPreviewUrl(currentImage || null);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete, currentImage, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1
  });

  const handleRemove = () => {
    setPreviewUrl(null);
    onUploadComplete('');
  };

  return (
    <div className="w-full">
      {previewUrl ? (
        <div className="relative w-full rounded-lg overflow-hidden border border-green-900/30 aspect-video">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-green-500 bg-green-950/20' : 'border-green-900/30 hover:border-green-500 hover:bg-green-950/10'}
            ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-full bg-green-950/30">
              {isDragActive ? (
                <ImageIcon className="h-6 w-6 text-green-500" />
              ) : (
                <Upload className="h-6 w-6 text-green-500" />
              )}
            </div>
            <div className="text-sm text-green-300">
              {isDragActive
                ? 'Drop the image here'
                : uploading
                ? 'Uploading...'
                : 'Drag & drop an image or click to select'}
            </div>
            <p className="text-xs text-green-600">PNG, JPG or WEBP (max 5MB)</p>
          </div>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
