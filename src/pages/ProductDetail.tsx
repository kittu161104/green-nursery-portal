
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductById } from "@/data/products";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    if (id) {
      const foundProduct = getProductById(id);
      setProduct(foundProduct || null);
    }
    setIsLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`Added ${quantity} x ${product.name} to cart`);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">Sorry, the product you're looking for doesn't exist.</p>
          <Link to="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/2">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <div>
              <Link
                to="/shop"
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                &larr; Back to all plants
              </Link>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="mt-2 text-2xl font-medium text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                className={`${
                  product.careLevel === "easy"
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : product.careLevel === "medium"
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                {product.careLevel === "easy"
                  ? "Easy Care"
                  : product.careLevel === "medium"
                  ? "Medium Care"
                  : "Expert Care"}
              </Badge>

              {product.petFriendly && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  Pet Friendly
                </Badge>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Light Needs</h3>
                  <p className="text-sm text-gray-600">
                    {product.lightNeeds === "low"
                      ? "Low Light"
                      : product.lightNeeds === "medium"
                      ? "Medium Light"
                      : "Bright Light"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Water Needs</h3>
                  <p className="text-sm text-gray-600">
                    {product.waterNeeds === "low"
                      ? "Low Water"
                      : product.waterNeeds === "medium"
                      ? "Medium Water"
                      : "Frequent Water"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center">
                <p className="text-sm font-medium text-gray-900">
                  Availability: {" "}
                  <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                  </span>
                </p>
              </div>

              {product.stock > 0 && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Care Instructions Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Care Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-3">Light</h3>
              <p>
                {product.lightNeeds === "low"
                  ? "This plant thrives in low light conditions, perfect for rooms with minimal natural light. Keep away from direct sunlight."
                  : product.lightNeeds === "medium"
                  ? "Place this plant in medium, indirect light. A few feet away from a window is ideal."
                  : "This plant loves bright, indirect light. Place near a window but avoid harsh direct sun."}
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-3">Water</h3>
              <p>
                {product.waterNeeds === "low"
                  ? "Water sparingly, allowing the soil to dry completely between waterings. Once every 2-3 weeks is typically sufficient."
                  : product.waterNeeds === "medium"
                  ? "Water when the top inch of soil feels dry to touch. Usually once a week, but adjust based on your home's humidity."
                  : "Maintain consistently moist soil, but not soggy. Water when the top surface begins to dry."}
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-3">Special Care</h3>
              <p>
                {product.careLevel === "easy"
                  ? "This hardy plant is very forgiving and perfect for beginners. It adapts well to various environments."
                  : product.careLevel === "medium"
                  ? "This plant requires moderate attention. Regular misting and occasional fertilization will help it thrive."
                  : "This plant requires specific conditions to thrive. Maintain consistent humidity and temperature for best results."}
              </p>
              {product.petFriendly ? (
                <p className="mt-2 text-green-700">
                  Safe for pets! Non-toxic to cats and dogs.
                </p>
              ) : (
                <p className="mt-2 text-red-700">
                  Keep away from pets! This plant can be toxic if ingested.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
