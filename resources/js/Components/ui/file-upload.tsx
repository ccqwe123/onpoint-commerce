import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, FileText, Image as ImageIcon, Video, File, GripVertical } from 'lucide-react';
import { Button } from '@/Components/Button';
import { Progress } from './progress';

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  preview?: string;
  status: 'uploading' | 'completed' | 'error';
}

interface FileUploadProps {
  onFilesAdded: (files: UploadedFile[]) => void;
  onFileRemoved: (fileId: string) => void;
  onFilesReordered: (files: UploadedFile[]) => void;
  uploadedFiles: UploadedFile[];
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  className?: string;
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return ImageIcon;
  if (fileType.startsWith('video/')) return Video;
  if (fileType.includes('pdf') || fileType.includes('document')) return FileText;
  return File;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export function FileUpload({
  onFilesAdded,
  onFileRemoved,
  onFilesReordered,
  uploadedFiles,
  accept = "image/*",
  maxSize = 10,
  multiple = true,
  className
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = useCallback((file: File): Promise<UploadedFile> => {
    return new Promise((resolve) => {
      const fileId = Math.random().toString(36).substr(2, 9);
      let progress = 0;
      
      const uploadedFile: UploadedFile = {
        id: fileId,
        file,
        progress: 0,
        status: 'uploading'
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }

      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          uploadedFile.progress = progress;
          uploadedFile.status = 'completed';
          onFilesAdded([uploadedFile]); // Update UI with completed status
          clearInterval(interval);
          resolve(uploadedFile);
        } else {
          uploadedFile.progress = progress;
          onFilesAdded([uploadedFile]);
        }
      }, 200);
    });
  }, [onFilesAdded]);

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Validate file size and type
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file. Only images are allowed.`);
        return false;
      }
      return true;
    });

    // Process files
    for (const file of validFiles) {
      await simulateUpload(file);
    }
  }, [maxSize, simulateUpload]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOverFile = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropFile = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newFiles = [...uploadedFiles];
    const draggedFile = newFiles[draggedIndex];
    
    // Remove dragged item
    newFiles.splice(draggedIndex, 1);
    
    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newFiles.splice(insertIndex, 0, draggedFile);
    
    onFilesReordered(newFiles);
    setDraggedIndex(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragOver 
            ? "border-primary bg-upload-hover" 
            : "border-upload-border bg-upload-bg hover:bg-upload-hover"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleUploadClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />
        
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-foreground font-medium mb-2">
          Click here to upload or drop images here
        </p>
        <p className="text-sm text-muted-foreground">
          Only images allowed • Maximum file size: {maxSize}MB
        </p>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((uploadedFile, index) => {
            const Icon = getFileIcon(uploadedFile.file.type);
            
            return (
              <div
                key={uploadedFile.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOverFile(e, index)}
                onDrop={(e) => handleDropFile(e, index)}
                className={cn(
                  "flex items-center gap-3 p-3 bg-card border border-border rounded-lg cursor-move transition-all",
                  draggedIndex === index && "opacity-50 scale-95"
                )}
              >
                {/* Drag Handle */}
                <div className="flex-shrink-0 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4" />
                </div>

                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {uploadedFile.preview ? (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {uploadedFile.file.name}
                    </p>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatFileSize(uploadedFile.file.size)}
                    </span>
                  </div>
                  
                  {uploadedFile.status === 'uploading' && (
                    <div className="space-y-1">
                      <Progress value={uploadedFile.progress} className="h-1" />
                      <p className="text-xs text-muted-foreground">
                        {Math.round(uploadedFile.progress)}% uploaded
                      </p>
                    </div>
                  )}
                  
                  {uploadedFile.status === 'completed' && (
                    <p className="text-xs text-success">Upload completed</p>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFileRemoved(uploadedFile.id)}
                  className="flex-shrink-0 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}