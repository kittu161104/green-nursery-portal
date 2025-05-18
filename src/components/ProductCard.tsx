
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  
  return (
    <div className="group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`} className="block h-64 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      
      <div className="p-4">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-lg font-medium">
            <Link to={`/product/${product.id}`} className="hover:text-green-600 transition-colors">
              {product.name}
            </Link>
          </h3>
          <p className="font-semibold text-green-700">${product.price.toFixed(2)}</p>
        </div>
        
        <div className="mt-1 mb-3 flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
            product.careLevel === 'easy' 
              ? 'bg-green-100 text-green-800' 
              : product.careLevel === 'medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.careLevel === 'easy' ? 'Easy Care' : 
             product.careLevel === 'medium' ? 'Medium Care' : 'Expert Care'}
          </span>
          
          {product.petFriendly && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
              Pet Friendly
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Link 
            to={`/product/${product.id}`}
            className="text-sm text-green-700 hover:text-green-800 font-medium"
          >
            View Details
          </Link>
          
          <Button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }} 
            variant="outline" 
            size="sm"
            className="text-green-700 border-green-700 hover:bg-green-700 hover:text-white transition-colors"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
