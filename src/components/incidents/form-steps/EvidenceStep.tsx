
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, File } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const EvidenceStep = () => {
  const { watch, setValue } = useFormContext();
  const evidence = watch('evidence') || [];
  const [isDragging, setIsDragging] = useState(false);

  // In a real app, this would upload to a server/storage
  // Here we're just creating a data URL for demo purposes
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Process each file
    Array.from(files).forEach(file => {
      // Check if it's an image file
      const isImage = file.type.startsWith('image/');
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const result = e.target?.result as string;
        
        // Add the new evidence item
        const newEvidence = {
          id: uuidv4(),
          type: isImage ? 'photo' : 'document',
          url: result,
          thumbnail: isImage ? result : undefined,
          name: file.name,
        };
        
        setValue('evidence', [...evidence, newEvidence], { shouldDirty: true });
      };

      fileReader.readAsDataURL(file);
    });
  };

  const removeEvidence = (id: string) => {
    setValue(
      'evidence',
      evidence.filter(item => item.id !== id),
      { shouldDirty: true }
    );
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Add Evidence</h2>
      
      {/* Upload buttons */}
      <div className="flex flex-wrap gap-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1 h-16 text-base"
          onClick={() => {
            // This would normally open the camera
            // For demo purposes, we'll just open the file picker
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'environment';
            input.onchange = (e) => handleFileUpload((e.target as HTMLInputElement).files);
            input.click();
          }}
        >
          <Camera className="mr-2 h-5 w-5" />
          Take Photo
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1 h-16 text-base"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            input.onchange = (e) => handleFileUpload((e.target as HTMLInputElement).files);
            input.click();
          }}
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload File
        </Button>
      </div>
      
      {/* Photos count */}
      <div>
        <h3 className="text-lg font-medium">
          Photos ({evidence.filter(e => e.type === 'photo').length}/10):
        </h3>
      </div>
      
      {/* Drag & Drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center h-40">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Drag photos here or tap to upload
          </p>
        </div>
      </div>
      
      {/* Evidence gallery */}
      {evidence.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {evidence.map((item) => (
            <div key={item.id} className="relative group">
              {item.type === 'photo' ? (
                <div className="aspect-square bg-gray-100 rounded-md overflow-hidden relative">
                  <img 
                    src={item.url} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-md overflow-hidden flex flex-col items-center justify-center p-4">
                  <File className="h-10 w-10 text-primary mb-2" />
                  <p className="text-xs text-center truncate w-full">
                    {item.name}
                  </p>
                </div>
              )}
              
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeEvidence(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvidenceStep;
