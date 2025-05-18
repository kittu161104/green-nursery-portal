
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { products, categories } from "@/data/products";
import { Product } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";

// Filter the categories to remove "Tropical" and "Pet-Friendly"
const filteredCategories = categories.filter(
  (category) => category.name !== "Tropical" && category.name !== "Pet-Friendly"
);

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Plants");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [customPriceMin, setCustomPriceMin] = useState("0");
  const [customPriceMax, setCustomPriceMax] = useState("100");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    petFriendly: false,
    easyCare: false,
    indoorOnly: false,
    outdoorOnly: false,
    lowLight: false,
    wateringLow: false,
  });

  // Get category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(
        filteredCategories.find((c) => c.name.toLowerCase() === categoryParam.toLowerCase())?.name || "All Plants"
      );
    }
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let result = [...products];
    
    // Apply search
    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "All Plants") {
      result = result.filter(
        (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply price filter
    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply additional filters
    if (filters.petFriendly) {
      result = result.filter((product) => product.petFriendly);
    }
    
    if (filters.easyCare) {
      result = result.filter((product) => product.careLevel === "easy");
    }

    if (filters.indoorOnly) {
      result = result.filter((product) => product.category.toLowerCase().includes("indoor"));
    }

    if (filters.outdoorOnly) {
      result = result.filter((product) => product.category.toLowerCase().includes("outdoor"));
    }

    if (filters.lowLight) {
      result = result.filter((product) => product.lightNeeds === "low");
    }

    if (filters.wateringLow) {
      result = result.filter((product) => product.waterNeeds === "low");
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, priceRange, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already handled by useEffect
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    // Update URL params
    if (category !== "All Plants") {
      setSearchParams({ category: category.toLowerCase() });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterChange = (key: keyof typeof filters) => {
    setFilters({
      ...filters,
      [key]: !filters[key],
    });
  };

  const handleCustomPriceApply = () => {
    const min = parseInt(customPriceMin);
    const max = parseInt(customPriceMax);
    
    if (!isNaN(min) && !isNaN(max) && min <= max) {
      setPriceRange([min, max]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-green-900/20 py-8 border-y border-green-900/30">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-green-300">Shop Our Plants</h1>
            <p className="mt-2 text-lg text-green-500">
              Find the perfect plants for your space and lifestyle
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Mobile filter toggle */}
          <div className="md:hidden mb-6">
            <Button 
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="w-full flex items-center justify-center bg-green-900/30 hover:bg-green-900/50 text-green-300 border border-green-900/30"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar filters */}
            <div className={`w-full md:w-64 space-y-6 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
              {/* Search */}
              <div className="glass-card p-4 rounded-lg border border-green-900/30">
                <h3 className="text-lg font-medium mb-3 text-green-300">Search</h3>
                <form onSubmit={handleSearch} className="flex">
                  <Input
                    type="text"
                    placeholder="Search plants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-r-none bg-black/40 border-green-900/50 text-green-300 placeholder:text-green-700"
                  />
                  <Button
                    type="submit"
                    className="rounded-l-none bg-green-800 hover:bg-green-700 text-green-300"
                  >
                    <Search size={18} />
                  </Button>
                </form>
              </div>

              {/* Categories */}
              <div className="glass-card p-4 rounded-lg border border-green-900/30">
                <h3 className="text-lg font-medium mb-3 text-green-300">Categories</h3>
                <ul className="space-y-2">
                  {filteredCategories.map((category) => (
                    <li key={category.id}>
                      <button
                        className={`text-left w-full py-1 px-2 rounded transition-colors ${
                          selectedCategory === category.name
                            ? "bg-green-900/50 text-green-300 font-medium"
                            : "hover:bg-green-900/20 text-green-400"
                        }`}
                        onClick={() => handleCategoryChange(category.name)}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="glass-card p-4 rounded-lg border border-green-900/30">
                <h3 className="text-lg font-medium mb-3 text-green-300">Price Range</h3>
                <div className="px-2">
                  <Slider
                    value={priceRange as [number, number]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="my-4"
                  />
                  <div className="flex items-center justify-between text-green-400">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-green-400">Custom Range:</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <span className="text-green-500 mr-1">$</span>
                        <Input
                          type="number"
                          value={customPriceMin}
                          onChange={(e) => setCustomPriceMin(e.target.value)}
                          className="w-16 bg-black/40 border-green-900/50 text-green-300"
                          min="0"
                        />
                      </div>
                      <span className="text-green-500">to</span>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-1">$</span>
                        <Input
                          type="number"
                          value={customPriceMax}
                          onChange={(e) => setCustomPriceMax(e.target.value)}
                          className="w-16 bg-black/40 border-green-900/50 text-green-300"
                          min="0"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleCustomPriceApply}
                      className="w-full mt-2 bg-green-800 hover:bg-green-700 text-green-300 text-xs"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>

              {/* Additional filters */}
              <div className="glass-card p-4 rounded-lg border border-green-900/30">
                <h3 className="text-lg font-medium mb-3 text-green-300">Filter By</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pet-friendly"
                      checked={filters.petFriendly}
                      onCheckedChange={() => handleFilterChange("petFriendly")}
                      className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                    />
                    <Label htmlFor="pet-friendly" className="text-green-400">Pet Friendly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="easy-care"
                      checked={filters.easyCare}
                      onCheckedChange={() => handleFilterChange("easyCare")}
                      className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                    />
                    <Label htmlFor="easy-care" className="text-green-400">Easy Care</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="indoor-only"
                      checked={filters.indoorOnly}
                      onCheckedChange={() => handleFilterChange("indoorOnly")}
                      className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                    />
                    <Label htmlFor="indoor-only" className="text-green-400">Indoor Only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="outdoor-only"
                      checked={filters.outdoorOnly}
                      onCheckedChange={() => handleFilterChange("outdoorOnly")}
                      className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                    />
                    <Label htmlFor="outdoor-only" className="text-green-400">Outdoor Only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="low-light"
                      checked={filters.lowLight}
                      onCheckedChange={() => handleFilterChange("lowLight")}
                      className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                    />
                    <Label htmlFor="low-light" className="text-green-400">Low Light Friendly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="watering-low"
                      checked={filters.wateringLow}
                      onCheckedChange={() => handleFilterChange("wateringLow")}
                      className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                    />
                    <Label htmlFor="watering-low" className="text-green-400">Low Watering Needs</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-green-400">
                  Showing {filteredProducts.length} products
                </p>
                <div>
                  {/* Sort options could be added here */}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 glass-card p-8 rounded-lg">
                    <h3 className="text-lg font-medium text-green-300 mb-2">
                      No products found
                    </h3>
                    <p className="text-green-400">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
