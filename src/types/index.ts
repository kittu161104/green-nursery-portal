
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  careLevel: 'easy' | 'medium' | 'hard';
  lightNeeds: 'low' | 'medium' | 'high';
  waterNeeds: 'low' | 'medium' | 'high';
  petFriendly: boolean;
  stock: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Category {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  shipping_status: string;
  items: CartItem[];
  created_at: string;
  updated_at?: string;
  shipping_address?: any;
  transaction_id?: string;
  upi_id?: string;
}

