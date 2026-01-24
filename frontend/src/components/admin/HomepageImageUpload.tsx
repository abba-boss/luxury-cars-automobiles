import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon, File, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { homepageImageService } from '@/services';
import { toast } from 'sonner';

interface HomepageImageUploadProps {
  onUploadSuccess?: () => void;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

const HomepageImageUpload = ({ onUploadSuccess }: HomepageImageUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/')
      );

      const newFileObjects = newFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        status: 'uploading' as const,
        progress: 0
      }));

      setFiles(prev => [...prev, ...newFileObjects]);
      
      // Process each file
      newFiles.forEach((file, index) => {
        setTimeout(() => uploadFile(file, newFileObjects[index].id), 100);
      });
    }
  };

  const uploadFile = async (file: File, fileId: string) => {
    try {
      setIsUploading(true);

      // First, upload the image to the server
      const uploadResponse = await uploadService.uploadHomepageImage(file);

      if (!uploadResponse.success || !uploadResponse.data) {
        throw new Error(uploadResponse.message || 'Upload failed');
      }

      // Then, create a new homepage image entry in the database
      const response = await homepageImageService.createHomepageImage({
        title: file.name.split('.')[0], // Use filename without extension as title
        subtitle: `Image uploaded on ${new Date().toLocaleDateString()}`,
        image_url: uploadResponse.data.url,
        cta_text: 'Learn More',
        cta_link: '#',
        position: 0, // Will be set based on order
        is_active: false, // Initially inactive
        section_type: 'hero'
      });

      if (response.success) {
        updateFileStatus(fileId, 'success');
        toast.success(`Successfully uploaded ${file.name}`);
      } else {
        updateFileStatus(fileId, 'error', response.message || 'Upload failed');
        toast.error(`Failed to upload ${file.name}: ${response.message}`);
      }

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Upload error:', error);
      updateFileStatus(fileId, 'error', error instanceof Error ? error.message : 'Upload failed');
      toast.error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const updateFileProgress = (fileId: string, progress: number) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, progress } : file
    ));
  };

  const updateFileStatus = (fileId: string, status: 'uploading' | 'success' | 'error', error?: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, status, error } : file
    ));
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const successCount = files.filter(f => f.status === 'success').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Homepage Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Click to upload images</p>
                <p className="text-sm text-muted-foreground">Supports JPG, PNG, WEBP up to 10MB</p>
              </div>
              <Button variant="outline" className="rounded-xl">
                Select Files
              </Button>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex gap-2">
                {successCount > 0 && (
                  <Badge variant="secondary">
                    {successCount} uploaded
                  </Badge>
                )}
                {errorCount > 0 && (
                  <Badge variant="destructive">
                    {errorCount} failed
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.map(file => (
                  <div key={file.id} className="border rounded-lg p-3 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      {file.file.type.startsWith('image/') ? (
                        <img 
                          src={file.preview} 
                          alt={file.file.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary">
                          <File className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <Progress value={file.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{file.progress}%</p>
                        </div>
                      )}
                      
                      {file.status === 'error' && file.error && (
                        <div className="flex items-center gap-1 mt-1 text-destructive">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs">{file.error}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive rounded-full"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HomepageImageUpload;