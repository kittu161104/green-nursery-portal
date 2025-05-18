
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
import { Search } from "lucide-react";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Plants");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [filters, setFilters] = useState({
    petFriendly: false,
    easyCare: false,
  });

  // Get category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(
        categories.find((c) => c.name.toLowerCase() === categoryParam.toLowerCase())?.name || "All Plants"
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
      if (selectedCategory === "Pet-Friendly") {
        result = result.filter((product) => product.petFriendly);
      } else {
        result = result.filter(
          (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-green-100 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-900">Shop Our Plants</h1>
            <p className="mt-2 text-lg text-gray-700">
              Find the perfect plants for your space and lifestyle
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar filters */}
            <div className="w-full md:w-64 space-y-6">
              {/* Search */}
              <div>
                <h3 className="text-lg font-medium mb-3">Search</h3>
                <form onSubmit={handleSearch} className="flex">
                  <Input
                    type="text"
                    placeholder="Search plants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-r-none"
                  />
                  <Button
                    type="submit"
                    className="rounded-l-none bg-green-600 hover:bg-green-700"
                  >
                    <Search size={18} />
                  </Button>
                </form>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-medium mb-3">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        className={`text-left w-full py-1 px-2 rounded ${
                          selectedCategory === category.name
                            ? "bg-green-100 text-green-800 font-medium"
                            : "hover:bg-gray-100"
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
              <div>
                <h3 className="text-lg font-medium mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[priceRange[0], priceRange[1]]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="my-4"
                  />
                  <div className="flex items-center justify-between">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Additional filters */}
              <div>
                <h3 className="text-lg font-medium mb-3">Filter By</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pet-friendly"
                      checked={filters.petFriendly}
                      onCheckedChange={() => handleFilterChange("petFriendly")}
                    />
                    <Label htmlFor="pet-friendly">Pet Friendly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="easy-care"
                      checked={filters.easyCare}
                      onCheckedChange={() => handleFilterChange("easyCare")}
                    />
                    <Label htmlFor="easy-care">Easy Care</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
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
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600">
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
