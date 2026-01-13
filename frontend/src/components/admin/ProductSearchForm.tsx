import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { productSearchService } from "@/services/productSearchService";

interface ProductData {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuel_type: string;
  transmission: string;
  condition: string;
  body_type: string;
  color: string;
  description: string;
  features: string[];
  images: string[];
  videos?: string[];
  source: string;
  sourceUrl: string;
}

const ProductSearchForm = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

  const searchProducts = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Call the external product search service
      const response = await productSearchService.searchExternalProducts({
        keyword: searchQuery
      });

      if (response.success && response.data) {
        setSearchResults(response.data);
        setSelectedProduct(null);
      } else {
        throw new Error(response.message || "Failed to search for products");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to search for products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportProduct = (product: ProductData) => {
    setSelectedProduct(product);
    toast({
      title: "Product Selected",
      description: `Selected ${product.make} ${product.model} for import`
    });
  };

  const handleAddToInventory = () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "No product selected",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would call the API to add the product to inventory
    toast({
      title: "Success",
      description: `Added ${selectedProduct.make} ${selectedProduct.model} to inventory`
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Real Products</CardTitle>
          <p className="text-sm text-muted-foreground">
            Search for real luxury cars from official sources and import them with high-quality images and detailed information
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Search Section */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search for Luxury Cars</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by make, model, or keyword..."
                    onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
                  />
                  <Button onClick={searchProducts} disabled={loading}>
                    {loading ? (
                      <>
                        <Search className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Search Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((product) => (
                    <Card 
                      key={product.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedProduct?.id === product.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleImportProduct(product)}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold">{product.make} {product.model}</h4>
                              <p className="text-sm text-muted-foreground">{product.year}</p>
                            </div>
                            <Badge variant="secondary">{product.condition}</Badge>
                          </div>
                          
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
                          
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">₦{product.price.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground">{product.transmission}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.features.slice(0, 3).map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {product.features.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                          
                          <div className="mt-auto">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{product.fuel_type}</span>
                              <span>{product.body_type}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                              <ExternalLink className="w-3 h-3" />
                              <span className="text-xs">{product.source}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Product Preview */}
            {selectedProduct && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Selected Product</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Product Images */}
                      <div>
                        <h4 className="font-medium mb-3">Images</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedProduct.images.map((img, idx) => (
                            <div key={idx} className="aspect-square bg-muted rounded overflow-hidden">
                              <img 
                                src={img} 
                                alt={`Image ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        
                        {selectedProduct.videos && selectedProduct.videos.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-3">Videos</h4>
                            <div className="space-y-2">
                              {selectedProduct.videos.map((video, idx) => (
                                <div key={idx} className="bg-muted rounded p-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    <span>Video {idx + 1}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <div>
                        <h4 className="font-medium mb-3">Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Make:</span>
                            <span>{selectedProduct.make}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Model:</span>
                            <span>{selectedProduct.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Year:</span>
                            <span>{selectedProduct.year}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span>₦{selectedProduct.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Condition:</span>
                            <span>{selectedProduct.condition}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fuel Type:</span>
                            <span>{selectedProduct.fuel_type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Transmission:</span>
                            <span>{selectedProduct.transmission}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Body Type:</span>
                            <span>{selectedProduct.body_type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Color:</span>
                            <span>{selectedProduct.color}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mileage:</span>
                            <span>{selectedProduct.mileage ? `${selectedProduct.mileage.toLocaleString()} km` : 'N/A'}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Features</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.features.map((feature, idx) => (
                              <Badge key={idx} variant="secondary">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Source</h4>
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            <a 
                              href={selectedProduct.sourceUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              {selectedProduct.source}
                            </a>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full mt-6" 
                          onClick={handleAddToInventory}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Add to Inventory
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductSearchForm;