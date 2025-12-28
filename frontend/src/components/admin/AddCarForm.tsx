import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface MediaFile {
  filename: string;
  originalName: string;
  url: string;  // Cloudinary URL
  publicId: string; // Cloudinary public ID
  size: number;
  format: string;
}

interface VehicleFormData {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  condition: string;
  body_type: string;
  color: string;
  description: string;
  features: string[];
  is_featured: boolean;
  is_hot_deal: boolean;
}

const AddCarForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<MediaFile[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<MediaFile[]>([]);
  const [newFeature, setNewFeature] = useState("");
  
  const [formData, setFormData] = useState<VehicleFormData>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuel_type: "Petrol",
    transmission: "Automatic",
    condition: "Tokunbo",
    body_type: "",
    color: "",
    description: "",
    features: [],
    is_featured: false,
    is_hot_deal: false
  });

  const handleInputChange = (field: keyof VehicleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (files: FileList, type: 'images' | 'videos') => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append(type, file);
    });

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/upload/vehicles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        if (type === 'images') {
          // Map the response to match our MediaFile interface
          const newImages = result.data.images.map(img => ({
            filename: img.filename,
            originalName: img.originalName,
            url: img.url,
            publicId: img.publicId,
            size: img.size,
            format: img.format
          }));
          setUploadedImages(prev => [...prev, ...newImages]);
        } else {
          // Map the response to match our MediaFile interface
          const newVideos = result.data.videos.map(vid => ({
            filename: vid.filename,
            originalName: vid.originalName,
            url: vid.url,
            publicId: vid.publicId,
            size: vid.size,
            format: vid.format,
            duration: vid.duration
          }));
          setUploadedVideos(prev => [...prev, ...newVideos]);
        }
        toast({
          title: "Success",
          description: `${type} uploaded successfully`
        });
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to upload ${type}`,
        variant: "destructive"
      });
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const removeMedia = (filename: string, type: 'images' | 'videos') => {
    if (type === 'images') {
      setUploadedImages(prev => prev.filter(img => img.filename !== filename));
    } else {
      setUploadedVideos(prev => prev.filter(vid => vid.filename !== filename));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const vehicleData = {
        ...formData,
        images: uploadedImages.map(img => img.url),
        videos: uploadedVideos.map(vid => vid.url)
      };

      const response = await fetch(`${API_URL}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vehicleData)
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Success",
          description: "Vehicle added successfully"
        });
        // Reset form
        setFormData({
          make: "",
          model: "",
          year: new Date().getFullYear(),
          price: 0,
          mileage: 0,
          fuel_type: "Petrol",
          transmission: "Automatic",
          condition: "Tokunbo",
          body_type: "",
          color: "",
          description: "",
          features: [],
          is_featured: false,
          is_hot_deal: false
        });
        setUploadedImages([]);
        setUploadedVideos([]);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price (₦)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="mileage">Mileage (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  min="0"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                />
              </div>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fuel_type">Fuel Type</Label>
                <Select value={formData.fuel_type} onValueChange={(value) => handleInputChange('fuel_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transmission">Transmission</Label>
                <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tokunbo">Tokunbo</SelectItem>
                    <SelectItem value="Nigerian Used">Nigerian Used</SelectItem>
                    <SelectItem value="Brand New">Brand New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="body_type">Body Type</Label>
              <Input
                id="body_type"
                value={formData.body_type}
                onChange={(e) => handleInputChange('body_type', e.target.value)}
                placeholder="e.g., Sedan, SUV, Hatchback"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            {/* Features */}
            <div>
              <Label>Features</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeFeature(index)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Media Upload */}
            <div className="space-y-4">
              <div>
                <Label>Images</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'images')}
                />
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-20 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.jpg'; // fallback image
                        }}
                      />
                      <X
                        className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full cursor-pointer"
                        onClick={() => removeMedia(img.filename, 'images')}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Videos</Label>
                <Input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'videos')}
                />
                <div className="space-y-2 mt-2">
                  {uploadedVideos.map((vid, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span>{vid.originalName}</span>
                        <div className="text-xs text-gray-500">{vid.format} - {(vid.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                      <X
                        className="w-4 h-4 cursor-pointer text-red-500"
                        onClick={() => removeMedia(vid.filename, 'videos')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Flags */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                />
                Featured Vehicle
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_hot_deal}
                  onChange={(e) => handleInputChange('is_hot_deal', e.target.checked)}
                />
                Hot Deal
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Adding Vehicle..." : "Add Vehicle"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCarForm;
