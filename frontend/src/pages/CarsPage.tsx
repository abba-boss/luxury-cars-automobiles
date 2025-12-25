import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CarCard } from "@/components/cars/CarCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { brands, conditions, formatPrice } from "@/data/cars";
import { localDb } from "@/lib/database";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
  ChevronDown,
  MapPin,
  DollarSign,
  Car,
  Calendar as CalendarIcon,
  Fuel as FuelIcon,
  Settings as SettingsIcon,
  Palette,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CarsPage = () => {
  const [searchParams] = useSearchParams();
  const brandFromUrl = searchParams.get("brand");

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(brandFromUrl ? [brandFromUrl] : []);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([]);
  const [selectedFuelType, setSelectedFuelType] = useState<string[]>([]);

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        console.log('Fetching vehicles from API...');
        const response = await fetch('http://localhost:3001/api/vehicles');
        const result = await response.json();
        console.log('API Response:', result);
        
        if (result.success && result.data) {
          // Map API data to Car interface
          const mappedCars = result.data.map(vehicle => ({
            id: vehicle.id.toString(),
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            price: parseFloat(vehicle.price),
            mileage: vehicle.mileage || 0,
            condition: vehicle.condition,
            transmission: vehicle.transmission,
            fuelType: vehicle.fuel_type,
            color: vehicle.color || '',
            images: vehicle.images ? vehicle.images.map(img => 
              img.startsWith('http') ? img : `http://localhost:3001${img}`
            ) : [],
            description: vehicle.description || '',
            features: vehicle.features || [],
            isVerified: vehicle.is_verified || false,
            isFeatured: vehicle.is_featured || false,
            isHotDeal: vehicle.is_hot_deal || false,
            createdAt: vehicle.created_at || new Date().toISOString()
          }));
          console.log('Mapped cars:', mappedCars);
          setCars(mappedCars);
        }
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Update filters when URL brand parameter changes
  useEffect(() => {
    if (brandFromUrl) {
      setSelectedBrands([brandFromUrl]);
    }
  }, [brandFromUrl]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [sortBy, setSortBy] = useState("newest");

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      searchQuery === "" ||
      `${car.make} ${car.model}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(car.make);
    const matchesCondition =
      selectedConditions.length === 0 || selectedConditions.includes(car.condition);
    const matchesTransmission =
      selectedTransmission.length === 0 || selectedTransmission.includes(car.transmission);
    const matchesFuelType =
      selectedFuelType.length === 0 || selectedFuelType.includes(car.fuelType);
    const matchesPrice =
      car.price >= priceRange[0] && car.price <= priceRange[1];

    return matchesSearch && matchesBrand && matchesCondition && matchesTransmission && matchesFuelType && matchesPrice;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "year":
        return b.year - a.year;
      default:
        return 0;
    }
  });

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const toggleTransmission = (transmission: string) => {
    setSelectedTransmission((prev) =>
      prev.includes(transmission) ? prev.filter((t) => t !== transmission) : [...prev, transmission]
    );
  };

  const toggleFuelType = (fuelType: string) => {
    setSelectedFuelType((prev) =>
      prev.includes(fuelType) ? prev.filter((f) => f !== fuelType) : [...prev, fuelType]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedConditions([]);
    setSelectedTransmission([]);
    setSelectedFuelType([]);
    setPriceRange([0, 100000000]);
    setSearchQuery("");
  };

  const activeFiltersCount =
    selectedBrands.length +
    selectedConditions.length +
    selectedTransmission.length +
    selectedFuelType.length +
    (priceRange[0] > 0 || priceRange[1] < 100000000 ? 1 : 0);

  return (
    <Layout title="Browse Cars" subtitle={`${sortedCars.length} vehicles available`}>
      {/* Search & Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by make, model, year..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl border-border/50 shadow-sm focus:shadow-md focus:ring-0 focus:ring-offset-0"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 px-4 border-border/50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="primary" className="ml-1 h-5 w-5 p-0 justify-center rounded-full">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-12 px-4 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="year">Year: Newest</option>
          </select>

          <div className="flex items-center border border-border rounded-xl overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none h-12 w-12"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none h-12 w-12"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card variant="premium" className="p-6 mb-8 animate-fade-in shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Advanced Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Brands */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block flex items-center gap-2">
                <Car className="h-4 w-4" />
                Brands
              </label>
              <div className="flex flex-wrap gap-2">
                {brands.slice(0, 8).map((brand) => (
                  <Button
                    key={brand}
                    variant={selectedBrands.includes(brand) ? "default" : "outline"}
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => toggleBrand(brand)}
                  >
                    {brand}
                  </Button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Condition
              </label>
              <div className="flex flex-wrap gap-2">
                {conditions.map((condition) => (
                  <Button
                    key={condition}
                    variant={
                      selectedConditions.includes(condition) ? "default" : "outline"
                    }
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => toggleCondition(condition)}
                  >
                    {condition}
                  </Button>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                Transmission
              </label>
              <div className="flex flex-wrap gap-2">
                {["Automatic", "Manual"].map((transmission) => (
                  <Button
                    key={transmission}
                    variant={selectedTransmission.includes(transmission) ? "default" : "outline"}
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => toggleTransmission(transmission)}
                  >
                    {transmission}
                  </Button>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block flex items-center gap-2">
                <FuelIcon className="h-4 w-4" />
                Fuel Type
              </label>
              <div className="flex flex-wrap gap-2">
                {["Petrol", "Diesel", "Hybrid", "Electric"].map((fuelType) => (
                  <Button
                    key={fuelType}
                    variant={selectedFuelType.includes(fuelType) ? "default" : "outline"}
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => toggleFuelType(fuelType)}
                  >
                    {fuelType}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price Range
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0] || ""}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="text-xs p-2 h-8"
                  />
                  <span className="text-muted-foreground text-xs">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1] === 100000000 ? "" : priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        Number(e.target.value) || 100000000,
                      ])
                    }
                    className="text-xs p-2 h-8"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-secondary/50 rounded-xl">
          <span className="text-sm text-muted-foreground font-medium">Active filters:</span>
          {selectedBrands.map((brand) => (
            <Badge
              key={brand}
              variant="secondary"
              className="gap-1 cursor-pointer px-3 py-1 text-xs"
              onClick={() => toggleBrand(brand)}
            >
              {brand}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {selectedConditions.map((condition) => (
            <Badge
              key={condition}
              variant="secondary"
              className="gap-1 cursor-pointer px-3 py-1 text-xs"
              onClick={() => toggleCondition(condition)}
            >
              {condition}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {selectedTransmission.map((transmission) => (
            <Badge
              key={transmission}
              variant="secondary"
              className="gap-1 cursor-pointer px-3 py-1 text-xs"
              onClick={() => toggleTransmission(transmission)}
            >
              {transmission}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {selectedFuelType.map((fuelType) => (
            <Badge
              key={fuelType}
              variant="secondary"
              className="gap-1 cursor-pointer px-3 py-1 text-xs"
              onClick={() => toggleFuelType(fuelType)}
            >
              {fuelType}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {(priceRange[0] > 0 || priceRange[1] < 100000000) && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer px-3 py-1 text-xs"
              onClick={() => setPriceRange([0, 100000000])}
            >
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              <X className="h-3 w-3" />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-7 text-xs"
            onClick={clearFilters}
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Showing <span className="text-foreground font-medium">{sortedCars.length}</span> results
          {sortedCars.length > 0 && ` for "${searchQuery || 'all vehicles'}"`}
        </p>
        <p className="text-sm text-muted-foreground">
          Sorted by: <span className="text-foreground font-medium">
            {sortBy === "newest" && "Newest First"}
            {sortBy === "price-low" && "Price: Low to High"}
            {sortBy === "price-high" && "Price: High to Low"}
            {sortBy === "year" && "Year: Newest"}
          </span>
        </p>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
            <Car className="h-10 w-10 text-muted-foreground animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Loading vehicles...</h3>
          <p className="text-muted-foreground">Please wait while we fetch the latest inventory.</p>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "gap-6",
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col"
            )}
          >
            {sortedCars.map((car, index) => (
              <div
                key={car.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <CarCard car={car} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {sortedCars.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No cars found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any cars matching your search. Try adjusting your filters or search query.
              </p>
              <Button onClick={clearFilters} className="px-8">
                Clear Filters
              </Button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default CarsPage;
