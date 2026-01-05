import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Check } from "lucide-react";
import { brandService } from "@/services";
import { Brand } from "@/types/api";
import { cn } from "@/lib/utils";

interface BrandTypeaheadProps {
  value?: number;
  onSelect: (brandId: number | undefined, brandName?: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

const BrandTypeahead = ({ value, onSelect, placeholder = "Search brands...", className, error }: BrandTypeaheadProps) => {
  const [query, setQuery] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load initial brand if value is provided
  useEffect(() => {
    if (value && !selectedBrand) {
      loadBrandById(value);
    }
  }, [value]);

  const loadBrandById = async (brandId: number) => {
    try {
      const response = await brandService.getBrand(brandId);
      if (response.success && response.data) {
        setSelectedBrand(response.data);
        setQuery(response.data.name);
      }
    } catch (error) {
      console.error("Failed to load brand:", error);
    }
  };

  const searchBrands = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setBrands([]);
      return;
    }

    console.log('Searching for brands:', searchQuery); // Debug log
    setLoading(true);
    try {
      const response = await brandService.searchBrands(searchQuery, 10);
      console.log('Search response:', response); // Debug log
      if (response.success) {
        setBrands(response.data || []);
      }
    } catch (error) {
      console.error("Failed to search brands:", error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query !== selectedBrand?.name) {
        searchBrands(query);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, selectedBrand]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true); // Always open dropdown when typing
    
    // Clear selection if query doesn't match selected brand
    if (selectedBrand && newQuery !== selectedBrand.name) {
      setSelectedBrand(null);
      onSelect(undefined);
    }
  };

  const handleBrandSelect = (brand: Brand) => {
    setSelectedBrand(brand);
    setQuery(brand.name);
    setIsOpen(false);
    onSelect(brand.id, brand.name);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    // If no query, load all brands
    if (!query.trim()) {
      loadAllBrands();
    } else if (!selectedBrand) {
      searchBrands(query);
    }
  };

  const loadAllBrands = async () => {
    setLoading(true);
    try {
      const response = await brandService.getBrands({ limit: 20 });
      if (response.success) {
        setBrands(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load brands:", error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay closing to allow clicking on dropdown items
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
        setIsOpen(false);
      }
    }, 150);
  };

  const handleCreateNew = () => {
    // This could open a modal to create a new brand
    // For now, we'll just clear the selection
    setSelectedBrand(null);
    setQuery("");
    onSelect(undefined);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Label htmlFor="brand">Brand</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="brand"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={cn(
            "pr-8",
            error && "border-red-500",
            selectedBrand && "border-green-500",
            className
          )}
        />
        {loading && (
          <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
        {selectedBrand && !loading && (
          <Check className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
        )}
      </div>
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {isOpen && (
        <Card
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto shadow-lg"
        >
          <div className="p-1">
            {loading ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : brands.length > 0 ? (
              <>
                {brands.map((brand) => (
                  <Button
                    key={brand.id}
                    variant="ghost"
                    className="w-full justify-start h-auto p-2 hover:bg-muted"
                    onClick={() => handleBrandSelect(brand)}
                  >
                    <div className="flex items-center gap-3">
                      {brand.image ? (
                        <img
                          src={brand.image}
                          alt={brand.name}
                          className="w-6 h-6 object-contain rounded"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {brand.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="font-medium">{brand.name}</span>
                    </div>
                  </Button>
                ))}
                {query && !brands.some(b => b.name.toLowerCase() === query.toLowerCase()) && (
                  <div className="border-t pt-1 mt-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-2 hover:bg-muted text-muted-foreground"
                      onClick={handleCreateNew}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create "{query}" (Contact admin to add new brands)
                    </Button>
                  </div>
                )}
              </>
            ) : query ? (
              <div className="py-3 px-2 text-center text-sm text-muted-foreground">
                No brands found for "{query}"
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={handleCreateNew}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Contact admin to add new brand
                </Button>
              </div>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
};

export default BrandTypeahead;
