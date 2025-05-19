
import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { IndianRupee } from 'lucide-react';
import FileUpload from './FileUpload';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id'> & { id?: string }) => void;
}

const ProductForm = ({ product, onSubmit }: ProductFormProps) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'> & { id?: string }>({
    id: product?.id,
    name: product?.name || '',
    price: product?.price || 0,
    description: product?.description || '',
    imageUrl: product?.imageUrl || '',
    category: product?.category || 'indoor',
    careLevel: product?.careLevel || 'easy',
    lightNeeds: product?.lightNeeds || 'medium',
    waterNeeds: product?.waterNeeds || 'medium',
    petFriendly: product?.petFriendly || false,
    stock: product?.stock || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleImageUpload = (url: string) => {
    setFormData({
      ...formData,
      imageUrl: url,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    
    if (formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    
    if (!formData.imageUrl.trim()) {
      toast.error("Product image is required");
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <IndianRupee className="h-4 w-4 text-green-600" />
            </div>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
        
        <div>
          <Label>Product Image</Label>
          <FileUpload 
            onUploadComplete={handleImageUpload}
            currentImage={formData.imageUrl}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indoor">Indoor</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="succulents">Succulents</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="careLevel">Care Level</Label>
            <Select
              value={formData.careLevel}
              onValueChange={(value) => handleSelectChange('careLevel', value as 'easy' | 'medium' | 'hard')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Care Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="lightNeeds">Light Needs</Label>
            <Select
              value={formData.lightNeeds}
              onValueChange={(value) => handleSelectChange('lightNeeds', value as 'low' | 'medium' | 'high')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Light Needs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="waterNeeds">Water Needs</Label>
            <Select
              value={formData.waterNeeds}
              onValueChange={(value) => handleSelectChange('waterNeeds', value as 'low' | 'medium' | 'high')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Water Needs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Switch
            id="petFriendly"
            checked={formData.petFriendly}
            onCheckedChange={(checked) => handleSwitchChange('petFriendly', checked)}
          />
          <Label htmlFor="petFriendly">Pet Friendly</Label>
        </div>
        
        <div>
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        {product ? 'Update Product' : 'Add Product'}
      </Button>
    </form>
  );
};

export default ProductForm;
