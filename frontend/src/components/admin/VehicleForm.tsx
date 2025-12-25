import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload, Plus, Save, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminService, CreateVehicleData, Vehicle } from "@/services/adminService";

interface VehicleFormProps {
  mode: 'create' | 'edit';
  vehicleId?: number;
}

const VehicleForm = ({ mode, vehicleId }: VehicleFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateVehicleData>({
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
    images: [],
    videos: [],
    is_featured: false,
    is_hot_deal: false
  });

  // Load vehicle data for edit mode
  useEffect(() => {
    if (mode === 'edit' && vehicleId) {
      loadVehicle();
    }
  }, [mode, vehicleId]);

  const loadVehicle = async () => {
    try {
      setLoading(true);
      const response = await adminService.getVehicle(vehicleId!);
      if (response.success && response.data) {
        const vehicle = response.data;
        setFormData({
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          price: parseFloat(vehicle.price),
          mileage: vehicle.mileage,
          fuel_type: vehicle.fuel_type,
          transmission: vehicle.transmission,
          condition: vehicle.condition,
          body_type: vehicle.body_type || "",
          color: vehicle.color,
          description: vehicle.description,
          features: vehicle.features || [],
          images: vehicle.images || [],
          videos: vehicle.videos || [],
          is_featured: vehicle.is_featured,
          is_hot_deal: vehicle.is_hot_deal
        });
        setUploadedImages(vehicle.images || []);
        setUploadedVideos(vehicle.videos || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load vehicle data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.make.trim()) newErrors.make = "Make is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = "Please enter a valid year";
    }
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!formData.color.trim()) newErrors.color = "Color is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateVehicleData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileUpload = async (files: FileList, type: 'images' | 'videos') => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadData = type === 'images' ? { images: files } : { videos: files };
      const response = await adminService.uploadMedia(uploadData);
      
      if (response.success && response.data) {
        if (type === 'images' && response.data.images) {
          const newImages = response.data.images.map(img => img.path);
          setUploadedImages(prev => [...prev, ...newImages]);
          setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        } else if (type === 'videos' && response.data.videos) {
          const newVideos = response.data.videos.map(vid => vid.path);
          setUploadedVideos(prev => [...prev, ...newVideos]);
          setFormData(prev => ({ ...prev, videos: [...prev.videos, ...newVideos] }));
        }
        
        toast({
          title: "Success",
          description: `${type} uploaded successfully`
        });
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to upload ${type}`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
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

  const removeMedia = (path: string, type: 'images' | 'videos') => {
    if (type === 'images') {
      setUploadedImages(prev => prev.filter(img => img !== path));
      setFormData(prev => ({ ...prev, images: prev.images.filter(img => img !== path) }));
    } else {
      setUploadedVideos(prev => prev.filter(vid => vid !== path));
      setFormData(prev => ({ ...prev, videos: prev.videos.filter(vid => vid !== path) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let response;
      if (mode === 'create') {
        response = await adminService.createVehicle(formData);
      } else {
        response = await adminService.updateVehicle(vehicleId!, formData);
      }

      if (response.success) {
        toast({
          title: "Success",
          description: `Vehicle ${mode === 'create' ? 'created' : 'updated'} successfully`
        });
        navigate('/admin/inventory');
      } else {
        throw new Error(response.message || `Failed to ${mode} vehicle`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} vehicle`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && mode === 'edit') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/inventory')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inventory
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === 'create' ? 'Add New Vehicle' : 'Edit Vehicle'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                className={errors.make ? 'border-red-500' : ''}
              />
              {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
            </div>
            
            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className={errors.model ? 'border-red-500' : ''}
              />
              {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
            </div>

            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                className={errors.year ? 'border-red-500' : ''}
              />
              {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
            </div>

            <div>
              <Label htmlFor="price">Price (₦) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
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
              <Label htmlFor="color">Color *</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className={errors.color ? 'border-red-500' : ''}
              />
              {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="md:col-span-3">
              <Label htmlFor="body_type">Body Type</Label>
              <Input
                id="body_type"
                value={formData.body_type}
                onChange={(e) => handleInputChange('body_type', e.target.value)}
                placeholder="e.g., Sedan, SUV, Hatchback"
              />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              placeholder="Describe the vehicle..."
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
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
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Images */}
            <div>
              <Label>Images</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'images')}
                disabled={uploading}
              />
              <div className="grid grid-cols-4 gap-2 mt-2">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={img.startsWith('http') ? img : `http://localhost:3001${img}`} 
                      alt="" 
                      className="w-full h-20 object-cover rounded" 
                    />
                    <X 
                      className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full cursor-pointer p-0.5"
                      onClick={() => removeMedia(img, 'images')}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Videos */}
            <div>
              <Label>Videos</Label>
              <Input
                type="file"
                multiple
                accept="video/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'videos')}
                disabled={uploading}
              />
              <div className="space-y-2 mt-2">
                {uploadedVideos.map((vid, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{vid.split('/').pop()}</span>
                    <X 
                      className="w-4 h-4 cursor-pointer text-red-500"
                      onClick={() => removeMedia(vid, 'videos')}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
              />
              <Label htmlFor="is_featured">Featured Vehicle</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_hot_deal"
                checked={formData.is_hot_deal}
                onCheckedChange={(checked) => handleInputChange('is_hot_deal', checked)}
              />
              <Label htmlFor="is_hot_deal">Hot Deal</Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading || uploading} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Create Vehicle' : 'Update Vehicle'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
