import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Plus, Download, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { productSearchService, ExternalProduct } from "@/services/productSearchService";

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
  const [searching, setSearching] = useState(false);
  const [importing, setImporting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<MediaFile[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<MediaFile[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [importProductId, setImportProductId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ExternalProduct[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
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
    // Check file sizes before uploading
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    const oversizedFiles = Array.from(files).filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      const oversizedFileNames = oversizedFiles.map(file => file.name).join(', ');
      toast({
        title: "File too large",
        description: `The following ${type === 'images' ? 'images' : 'videos'} exceed the 10MB limit: ${oversizedFileNames}. Please compress them before uploading.`,
        variant: "destructive"
      });
      return;
    }

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

  const handleImportProduct = async () => {
    if (!importProductId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a product ID to import",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
    try {
      const response = await productSearchService.getExternalProductDetails(importProductId);

      if (response.success && response.data) {
        const product = response.data;

        // Update form data with imported product data
        setFormData(prev => ({
          ...prev,
          make: product.make,
          model: product.model,
          year: product.year,
          price: product.price,
          mileage: product.mileage || 0,
          fuel_type: product.fuel_type,
          transmission: product.transmission,
          condition: product.condition,
          body_type: product.body_type,
          color: product.color,
          description: product.description,
          features: product.features,
          is_featured: false,
          is_hot_deal: false
        }));

        // Update uploaded media
        setUploadedImages(product.images.map(url => ({
          filename: url.split('/').pop() || `image-${Date.now()}`,
          originalName: url.split('/').pop() || `image-${Date.now()}.jpg`,
          url,
          publicId: url, // For demo purposes
          size: 0, // Size would come from API in real implementation
          format: url.split('.').pop() || 'jpg'
        })));

        if (product.videos) {
          setUploadedVideos(product.videos.map(url => ({
            filename: url.split('/').pop() || `video-${Date.now()}`,
            originalName: url.split('/').pop() || `video-${Date.now()}.mp4`,
            url,
            publicId: url, // For demo purposes
            size: 0, // Size would come from API in real implementation
            format: url.split('.').pop() || 'mp4'
          })));
        }

        toast({
          title: "Success",
          description: `Imported ${product.make} ${product.model} successfully`
        });
      } else {
        throw new Error(response.message || "Failed to import product");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import product",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const handleSearchProducts = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive"
      });
      return;
    }

    setSearching(true);
    try {
      const response = await productSearchService.searchExternalProducts({
        keyword: searchQuery
      });

      if (response.success && response.data) {
        setSearchResults(response.data);
      } else {
        throw new Error(response.message || "Failed to search for products");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search for products",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
  };

  const handleSelectProduct = (product: ExternalProduct) => {
    // Update form data with selected product data
    setFormData(prev => ({
      ...prev,
      make: product.make,
      model: product.model,
      year: product.year,
      price: product.price,
      mileage: product.mileage || 0,
      fuel_type: product.fuel_type,
      transmission: product.transmission,
      condition: product.condition,
      body_type: product.body_type,
      color: product.color,
      description: product.description,
      features: product.features,
      is_featured: false,
      is_hot_deal: false
    }));

    // Update uploaded media
    setUploadedImages(product.images.map(url => ({
      filename: url.split('/').pop() || `image-${Date.now()}`,
      originalName: url.split('/').pop() || `image-${Date.now()}.jpg`,
      url,
      publicId: url, // For demo purposes
      size: 0, // Size would come from API in real implementation
      format: url.split('.').pop() || 'jpg'
    })));

    if (product.videos) {
      setUploadedVideos(product.videos.map(url => ({
        filename: url.split('/').pop() || `video-${Date.now()}`,
        originalName: url.split('/').pop() || `video-${Date.now()}.mp4`,
        url,
        publicId: url, // For demo purposes
        size: 0, // Size would come from API in real implementation
        format: url.split('.').pop() || 'mp4'
      })));
    }

    toast({
      title: "Success",
      description: `Imported ${product.make} ${product.model} successfully`
    });

    setShowSearchModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      // Use the current uploaded images and videos
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

            {/* Import Product */}
            <div className="space-y-2">
              <Label>Import Product Data</Label>
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
                      <span className="mr-2">Importing...</span>
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
              <p className="text-xs text-muted-foreground">
                Enter a product ID to import or search for products from external sources
              </p>
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

          {/* Product Search Modal */}
          {showSearchModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-background rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Search External Products</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSearchModal(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>

                <div className="p-6 flex-1 overflow-auto">
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for luxury cars..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSearchProducts()}
                      className="flex-1"
                    />
                    <Button onClick={handleSearchProducts} disabled={searching}>
                      {searching ? (
                        <>
                          <span>Searching...</span>
                        </>
                      ) : (
                        "Search"
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((product) => (
                      <Card
                        key={product.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleSelectProduct(product)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-video bg-muted rounded-md mb-3 overflow-hidden">
                            {product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={`${product.make} ${product.model}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-muted-foreground">No image</span>
                              </div>
                            )}
                          </div>

                          <h4 className="font-bold">{product.make} {product.model}</h4>
                          <p className="text-sm text-muted-foreground">{product.year} • ₦{product.price.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground mt-1">{product.description.substring(0, 60)}...</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCarForm;
