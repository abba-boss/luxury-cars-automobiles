import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { brands, conditions, transmissions } from "@/data/cars";
import {
  Upload,
  X,
  Car,
  DollarSign,
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  Palette,
  FileText,
  ImagePlus,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddCarPage = () => {
  const { toast } = useToast();

  // Separate state for each image category
  const [exteriorImages, setExteriorImages] = useState<string[]>([]);
  const [interiorImages, setInteriorImages] = useState<string[]>([]);
  const [engineImages, setEngineImages] = useState<string[]>([]);
  const [wheelsImages, setWheelsImages] = useState<string[]>([]);

  // Separate state for each video category
  const [exteriorVideos, setExteriorVideos] = useState<string[]>([]);
  const [interiorVideos, setInteriorVideos] = useState<string[]>([]);
  const [engineSoundVideos, setEngineSoundVideos] = useState<string[]>([]);
  const [performanceVideos, setPerformanceVideos] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    condition: "",
    transmission: "",
    fuelType: "",
    color: "",
    description: "",
  });

  // Handle image uploads by category
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, category: 'exterior' | 'interior' | 'engine' | 'wheels') => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );

      switch(category) {
        case 'exterior':
          setExteriorImages((prev) => [...prev, ...newImages].slice(0, 10));
          break;
        case 'interior':
          setInteriorImages((prev) => [...prev, ...newImages].slice(0, 10));
          break;
        case 'engine':
          setEngineImages((prev) => [...prev, ...newImages].slice(0, 10));
          break;
        case 'wheels':
          setWheelsImages((prev) => [...prev, ...newImages].slice(0, 10));
          break;
      }
    }
  };

  // Handle video uploads by category
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>, category: 'exterior' | 'interior' | 'engineSound' | 'performance') => {
    const files = e.target.files;
    if (files) {
      const newVideos = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );

      switch(category) {
        case 'exterior':
          setExteriorVideos((prev) => [...prev, ...newVideos].slice(0, 5));
          break;
        case 'interior':
          setInteriorVideos((prev) => [...prev, ...newVideos].slice(0, 5));
          break;
        case 'engineSound':
          setEngineSoundVideos((prev) => [...prev, ...newVideos].slice(0, 5));
          break;
        case 'performance':
          setPerformanceVideos((prev) => [...prev, ...newVideos].slice(0, 5));
          break;
      }
    }
  };

  // Remove image by category
  const removeImage = (index: number, category: 'exterior' | 'interior' | 'engine' | 'wheels') => {
    switch(category) {
      case 'exterior':
        setExteriorImages((prev) => prev.filter((_, i) => i !== index));
        break;
      case 'interior':
        setInteriorImages((prev) => prev.filter((_, i) => i !== index));
        break;
      case 'engine':
        setEngineImages((prev) => prev.filter((_, i) => i !== index));
        break;
      case 'wheels':
        setWheelsImages((prev) => prev.filter((_, i) => i !== index));
        break;
    }
  };

  // Remove video by category
  const removeVideo = (index: number, category: 'exterior' | 'interior' | 'engineSound' | 'performance') => {
    switch(category) {
      case 'exterior':
        setExteriorVideos((prev) => prev.filter((_, i) => i !== index));
        break;
      case 'interior':
        setInteriorVideos((prev) => prev.filter((_, i) => i !== index));
        break;
      case 'engineSound':
        setEngineSoundVideos((prev) => prev.filter((_, i) => i !== index));
        break;
      case 'performance':
        setPerformanceVideos((prev) => prev.filter((_, i) => i !== index));
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Combine all images and videos into a single object for submission
    const vehicleData = {
      ...formData,
      year: parseInt(formData.year),
      price: parseFloat(formData.price),
      mileage: parseInt(formData.mileage),
      images: [
        ...exteriorImages,
        ...interiorImages,
        ...engineImages,
        ...wheelsImages
      ],
      videos: [
        ...exteriorVideos,
        ...interiorVideos,
        ...engineSoundVideos,
        ...performanceVideos
      ],
      // Optionally, you can add metadata to identify image types
      imageMetadata: {
        exterior: exteriorImages.length,
        interior: interiorImages.length,
        engine: engineImages.length,
        wheels: wheelsImages.length
      },
      videoMetadata: {
        exterior: exteriorVideos.length,
        interior: interiorVideos.length,
        engineSound: engineSoundVideos.length,
        performance: performanceVideos.length
      }
    };

    try {
      // Here you would typically make an API call to submit the vehicle
      // await vehicleService.createVehicle(vehicleData);

      toast({
        title: "Car listing created!",
        description: "Your car has been submitted for review.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit vehicle. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout title="Add New Car" subtitle="List your vehicle for sale">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {/* Image Upload Sections */}
        <Card variant="premium" className="p-6 mb-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-primary" />
              Vehicle Photos
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Upload high-quality photos for each category
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Exterior Images */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Exterior</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {exteriorImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <img
                        src={image}
                        alt={`Exterior ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, 'exterior')}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <Badge className="absolute bottom-2 left-2" variant="default">
                          Cover
                        </Badge>
                      )}
                    </div>
                  ))}
                  {exteriorImages.length < 10 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-secondary/50">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'exterior')}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Interior Images */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Interior</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {interiorImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <img
                        src={image}
                        alt={`Interior ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, 'interior')}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {interiorImages.length < 10 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-secondary/50">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'interior')}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Engine Images */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Engine</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {engineImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <img
                        src={image}
                        alt={`Engine ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, 'engine')}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {engineImages.length < 10 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-secondary/50">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'engine')}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Wheels Images */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Wheels</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wheelsImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <img
                        src={image}
                        alt={`Wheels ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, 'wheels')}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {wheelsImages.length < 10 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-secondary/50">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'wheels')}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Upload Sections */}
        <Card variant="premium" className="p-6 mb-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Vehicle Videos
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Upload videos for each category
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Exterior Videos */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Exterior</h3>
                <div className="grid grid-cols-1 gap-4">
                  {exteriorVideos.map((video, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-xl overflow-hidden group"
                    >
                      <video
                        src={video}
                        controls
                        className="w-full h-full object-contain bg-black"
                      />
                      <button
                        type="button"
                        onClick={() => removeVideo(index, 'exterior')}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        Video {index + 1}
                      </div>
                    </div>
                  ))}
                  {exteriorVideos.length < 5 && (
                    <label className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-secondary/50">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Add Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleVideoUpload(e, 'exterior')}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Interior Videos */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Interior</h3>
                <div className="grid grid-cols-1 gap-4">
                  {interiorVideos.map((video, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-xl overflow-hidden group"
                    >
                      <video
                        src={video}
                        controls
                        className="w-full h-full object-contain bg-black"
                      />
                      <button
                        type="button"
                        onClick={() => removeVideo(index, 'interior')}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        Video {index + 1}
                      </div>
                    </div>
                  ))}
                  {interiorVideos.length < 5 && (
                    <label className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-secondary/50">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Add Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleVideoUpload(e, 'interior')}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Engine / Sound Videos */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Engine / Sound</h3>
                <div className="grid grid-cols-1 gap-4">
                  {engineSoundVideos.map((video, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-xl overflow-hidden group"
                    >
                      <video
                        src={video}
                        controls
                        className="w-full h-full object-contain bg-black"
                      />
                      <button
                        type="button"
                        onClick={() => removeVideo(index, 'engineSound')}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        Video {index + 1}
                      </div>
                    </div>
                  ))}
                  {engineSoundVideos.length < 5 && (
                    <label className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-secondary/50">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Add Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleVideoUpload(e, 'engineSound')}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Performance Videos */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Performance</h3>
                <div className="grid grid-cols-1 gap-4">
                  {performanceVideos.map((video, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-xl overflow-hidden group"
                    >
                      <video
                        src={video}
                        controls
                        className="w-full h-full object-contain bg-black"
                      />
                      <button
                        type="button"
                        onClick={() => removeVideo(index, 'performance')}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        Video {index + 1}
                      </div>
                    </div>
                  ))}
                  {performanceVideos.length < 5 && (
                    <label className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-secondary/50">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Add Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleVideoUpload(e, 'performance')}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card variant="premium" className="p-6 mb-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Make / Brand
                </label>
                <select
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Model
                </label>
                <Input
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g. Camry, Accord, RX 350"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Year
                </label>
                <Input
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g. 2022"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                >
                  <option value="">Select Condition</option>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card variant="premium" className="p-6 mb-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Mileage (km)
                </label>
                <div className="relative">
                  <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    placeholder="e.g. 50000"
                    className="pl-11"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                >
                  <option value="">Select Transmission</option>
                  {transmissions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Color
                </label>
                <div className="relative">
                  <Palette className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g. Black, White, Silver"
                    className="pl-11"
                    required
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Price (₦)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 15000000"
                    className="pl-11"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card variant="premium" className="p-6 mb-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your vehicle in detail. Include information about its history, features, and condition..."
              className="w-full h-32 p-4 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              required
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button type="button" variant="secondary" size="lg">
            Save as Draft
          </Button>
          <Button type="submit" variant="hero" size="lg" className="gap-2">
            <CheckCircle className="h-5 w-5" />
            Submit for Review
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default AddCarPage;
