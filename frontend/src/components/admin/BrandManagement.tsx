import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Search, Loader2, Car } from "lucide-react";
import { brandService } from "@/services";
import { Brand } from "@/types/api";
import { toast } from "sonner";

const BrandManagement = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: "", image: "" });
  const [submitting, setSubmitting] = useState(false);
  const [imageMethod, setImageMethod] = useState<'url' | 'file'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, [searchQuery]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await brandService.getBrands({
        search: searchQuery || undefined,
        include_vehicle_count: true,
        limit: 50
      });
      if (response.success) {
        setBrands(response.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      // For now, we'll handle the file upload separately in the submit function
      // Just update the form data with a placeholder
      setFormData(prev => ({ ...prev, image: previewUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    setSubmitting(true);
    try {
      // Prepare form data based on the selected method
      let submitData = { ...formData };

      if (imageMethod === 'file' && selectedFile) {
        // For file upload, we need to use multipart/form-data
        const brandData = new FormData();
        brandData.append('name', formData.name);
        brandData.append('image', selectedFile);

        let response;
        if (editingBrand) {
          response = await brandService.updateBrandWithFile(editingBrand.id, brandData);
        } else {
          response = await brandService.createBrandWithFile(brandData);
        }

        if (response.success) {
          toast.success(`Brand ${editingBrand ? 'updated' : 'created'} successfully`);
          fetchBrands();
        } else {
          throw new Error(response.message || 'Failed to save brand');
        }
      } else {
        // For URL method, use the original approach
        let response;
        if (editingBrand) {
          response = await brandService.updateBrand(editingBrand.id, submitData);
        } else {
          response = await brandService.createBrand(submitData);
        }

        if (response.success) {
          toast.success(`Brand ${editingBrand ? 'updated' : 'created'} successfully`);
          fetchBrands();
        } else {
          throw new Error(response.message || 'Failed to save brand');
        }
      }

      handleCloseDialog();
    } catch (error: any) {
      toast.error(error.message || "Failed to save brand");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (brand: Brand) => {
    try {
      const response = await brandService.deleteBrand(brand.id);
      if (response.success) {
        toast.success("Brand deleted successfully");
        fetchBrands();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete brand");
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    const brandImage = brand.image || "";
    // Determine if the image is a URL or a local file
    const isUrl = brandImage.startsWith('http') || brandImage.startsWith('/');
    setFormData({ name: brand.name, image: brandImage });
    setImageMethod(isUrl ? 'url' : 'file');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBrand(null);
    setFormData({ name: "", image: "" });
    setImageMethod('url');
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Brand Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingBrand(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBrand ? "Edit Brand" : "Add New Brand"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Brand Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter brand name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="imageMethod">Image Method</Label>
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="urlMethod"
                      name="imageMethod"
                      checked={imageMethod === 'url'}
                      onChange={() => setImageMethod('url')}
                    />
                    <Label htmlFor="urlMethod">URL</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="fileMethod"
                      name="imageMethod"
                      checked={imageMethod === 'file'}
                      onChange={() => setImageMethod('file')}
                    />
                    <Label htmlFor="fileMethod">Local File</Label>
                  </div>
                </div>

                {imageMethod === 'url' ? (
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/brand-logo.png"
                  />
                ) : (
                  <div>
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {previewImage && (
                      <div className="mt-2">
                        <Label>Preview:</Label>
                        <div className="mt-1">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-[200px] max-h-[100px] object-contain border rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingBrand ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card variant="premium">
        <CardHeader className="p-4 bg-muted/5 rounded-t-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-foreground" />
              Brands ({filteredBrands.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Vehicles</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell>
                      {brand.image ? (
                        <img
                          src={brand.image}
                          alt={brand.name}
                          className="w-8 h-8 object-contain rounded"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          <Car className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {brand.vehicle_count || 0} vehicles
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(brand.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(brand)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{brand.name}"? 
                                {brand.vehicle_count && brand.vehicle_count > 0 && (
                                  <span className="text-red-600 font-medium">
                                    {" "}This brand has {brand.vehicle_count} associated vehicles and cannot be deleted.
                                  </span>
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(brand)}
                                disabled={brand.vehicle_count && brand.vehicle_count > 0}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBrands.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No brands found matching your search" : "No brands found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandManagement;
