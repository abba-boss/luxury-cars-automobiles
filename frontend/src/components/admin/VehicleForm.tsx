import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "@/components/ui/loading";
import { toast } from "sonner";
import {
  X,
  Upload,
  Plus,
  Save,
  ArrowLeft,
  Loader2,
  Download,
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  DollarSign,
  User,
  Car,
  Fuel,
  Settings,
  ShoppingCart,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  Star,
  Filter,
  Paperclip,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminService } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/dateUtils";
import BrandTypeahead from "../ui/BrandTypeahead";

interface CreateVehicleData {
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
  images: string[];
  videos: string[];
  is_featured: boolean;
  is_hot_deal: boolean;
  is_verified: boolean;
  status: string;
  brand_id?: number;
  acceleration: string;
  top_speed: string;
  power: string;
  torque: string;
}

interface VehicleFormProps {
  mode: 'create' | 'edit';
  vehicleId?: number;
}

const VehicleForm = ({ mode, vehicleId }: VehicleFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [searching, setSearching] = useState(false);
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
    is_hot_deal: false,
    is_verified: false,
    status: "available",
    brand_id: undefined,
    acceleration: "",
    top_speed: "",
    power: "",
    torque: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newFeature, setNewFeature] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [importProductId, setImportProductId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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
          price: typeof vehicle.price === 'string' ? (parseFloat(vehicle.price) || 0) : (vehicle.price || 0),
          mileage: vehicle.mileage || 0,
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
          is_hot_deal: vehicle.is_hot_deal,
          is_verified: vehicle.is_verified || false,
          status: vehicle.status || "available",
          brand_id: vehicle.brand_id,
          acceleration: vehicle.acceleration || "",
          top_speed: vehicle.top_speed || "",
          power: vehicle.power || "",
          torque: vehicle.torque || ""
        });
        setUploadedImages(vehicle.images || []);
        setUploadedVideos(vehicle.videos || []);
      }
    } catch (error) {
      toast.error("Failed to load vehicle data");
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

  const handleNumericChange = (field: keyof CreateVehicleData, value: string, isFloat = false) => {
    if (value === '') {
      handleInputChange(field, isFloat ? 0 : 0);
      return;
    }

    const numericValue = isFloat ? parseFloat(value) : parseInt(value);
    if (!isNaN(numericValue)) {
      handleInputChange(field, numericValue);
    }
  };

  const handleFileUpload = async (files: FileList, type: 'images' | 'videos') => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append(type, files[i]);
      }

      const response = await adminService.uploadVehicleMedia({
        images: type === 'images' ? files : undefined,
        videos: type === 'videos' ? files : undefined
      });

      if (response.success && response.data) {
        if (type === 'images' && response.data.image_urls) {
          const newImages = response.data.image_urls;
          setUploadedImages(prev => [...prev, ...newImages]);
          setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        } else if (type === 'videos' && response.data.video_urls) {
          const newVideos = response.data.video_urls;
          setUploadedVideos(prev => [...prev, ...newVideos]);
          setFormData(prev => ({ ...prev, videos: [...prev.videos, ...newVideos] }));
        }

        toast.success(`${files.length} ${type} uploaded successfully`);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      toast.error(`Failed to upload ${type}`);
    } finally {
      setUploading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
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

  const handleImportProduct = async () => {
    if (!importProductId.trim()) {
      toast.error("Please enter a product ID to import");
      return;
    }

    setImporting(true);
    try {
      // In a real implementation, this would call the import API
      // const response = await productService.importProduct(importProductId);
      // if (response.success) {
      //   setFormData(response.data);
      //   toast.success("Product imported successfully");
      // } else {
      //   throw new Error(response.message || "Failed to import product");
      // }
      
      // For demo purposes, just show a toast
      toast.success("Product import functionality would be implemented here");
    } catch (error) {
      toast.error("Failed to import product");
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
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
        toast.success(`Vehicle ${mode === 'create' ? 'created' : 'updated'} successfully`);
        navigate('/admin/cars');
      } else {
        throw new Error(response.message || `Failed to ${mode} vehicle`);
      }
    } catch (error) {
      toast.error(`Failed to ${mode} vehicle`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && mode === 'edit') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/cars')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inventory
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === 'create' ? 'Add New Vehicle' : 'Edit Vehicle'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card variant="premium">
          <CardHeader className="p-4 bg-muted/5 rounded-t-xl">
            <CardTitle className="text-lg flex items-center gap-2">
              <Car className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand_id">Brand *</Label>
                <BrandTypeahead
                  value={formData.brand_id}
                  onSelect={(brandId) => handleInputChange('brand_id', brandId)}
                  error={errors.brand_id}
                />
              </div>

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
                  onChange={(e) => handleNumericChange('year', e.target.value)}
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
                  onChange={(e) => handleNumericChange('price', e.target.value, true)}
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
                  onChange={(e) => handleNumericChange('mileage', e.target.value)}
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
            </div>
          </CardContent>
        </Card>

        {/* Import Product */}
        <Card variant="premium">
          <CardHeader className="p-4 bg-muted/5 rounded-t-xl">
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="w-5 h-5" />
              Import Product Data
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Import product information from external sources
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Input
                value={importProductId}
                onChange={(e) => setImportProductId(e.target.value)}
                placeholder="Enter product ID to import"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleImportProduct}
                disabled={importing}
                variant="secondary"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Import
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => setShowSearchModal(true)}
                variant="outline"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Enter a product ID to import or search for products from external sources
            </p>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card variant="premium">
          <CardHeader className="p-4 bg-muted/5 rounded-t-xl">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
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

              <div className="md:col-span-3">
                <Label htmlFor="body_type">Body Type</Label>
                <Input
                  id="body_type"
                  value={formData.body_type}
                  onChange={(e) => handleInputChange('body_type', e.target.value)}
                  placeholder="e.g., Sedan, SUV, Hatchback"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card variant="premium">
          <CardHeader className="p-4 bg-muted/5 rounded-t-xl">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="acceleration">0-60 mph</Label>
                <Input
                  id="acceleration"
                  value={formData.acceleration}
                  onChange={(e) => handleInputChange('acceleration', e.target.value)}
                  placeholder="e.g., 5.8s"
                />
              </div>

              <div>
                <Label htmlFor="top_speed">Top Speed</Label>
                <Input
                  id="top_speed"
                  value={formData.top_speed}
                  onChange={(e) => handleInputChange('top_speed', e.target.value)}
                  placeholder="e.g., 155 mph"
                />
              </div>

              <div>
                <Label htmlFor="power">Power</Label>
                <Input
                  id="power"
                  value={formData.power}
                  onChange={(e) => handleInputChange('power', e.target.value)}
                  placeholder="e.g., 335 hp"
                />
              </div>

              <div>
                <Label htmlFor="torque">Torque</Label>
                <Input
                  id="torque"
                  value={formData.torque}
                  onChange={(e) => handleInputChange('torque', e.target.value)}
                  placeholder="e.g., 368 lb-ft"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card variant="premium">
          <CardHeader className="p-4 bg-muted/5 rounded-t-xl">
            <CardTitle className="text-lg flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
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
        <Card variant="premium">
          <CardHeader className="p-4 bg-muted/5 rounded-t-xl">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5" />
              Features
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Quick Add Common Features */}
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">Quick Add Features</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Air Conditioning", "Leather Seats", "Sunroof", "Navigation System",
                  "Backup Camera", "Bluetooth", "Cruise Control", "Heated Seats",
                  "Premium Sound System", "Keyless Entry", "Push Start", "Parking Sensors",
                  "Lane Departure Warning", "Blind Spot Monitoring", "Adaptive Cruise Control",
                  "Wireless Charging", "Apple CarPlay", "Android Auto", "360° Camera",
                  "Panoramic Sunroof", "Ventilated Seats", "Memory Seats", "Power Tailgate"
                ].map((feature) => (
                  <Button
                    key={feature}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!formData.features.includes(feature)) {
                        setFormData(prev => ({
                          ...prev,
                          features: [...prev.features, feature]
                        }));
                      }
                    }}
                    disabled={formData.features.includes(feature)}
                    className="text-xs"
                  >
                    {formData.features.includes(feature) ? "✓ " : "+ "}{feature}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Feature Input */}
            <div className="flex gap-2 mb-4">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a custom feature"
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

        {/* Status & Verification */}
        <Card variant="premium">
          <CardHeader className="p-4 bg-muted/5 rounded-t-xl">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Status & Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_verified"
                  checked={formData.is_verified}
                  onCheckedChange={(checked) => handleInputChange('is_verified', checked)}
                />
                <Label htmlFor="is_verified">Verified Vehicle</Label>
              </div>

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
            </div>
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card variant="premium">
          <CardHeader className="p-4 bg-muted/5 rounded-t-xl">
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Media
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-2">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}${img}`}
                      alt={`Vehicle image ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-car.jpg';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(img, 'images')}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
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
                  <div key={index} className="flex items-center justify-between p-2 border rounded bg-secondary">
                    <span className="text-sm truncate flex-1 mr-2">
                      {typeof vid === 'string' ? vid.split('/').pop() : 'Video file'}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMedia(vid, 'videos')}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1 gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
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