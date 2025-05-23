
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

// Updated Order interface to be compatible with Supabase's JSON type
export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  shipping_status: string;
  items: CartItem[] | any; // Allow for JSON conversion
  created_at: string;
  updated_at?: string;
  shipping_address?: any;
  transaction_id?: string;
  upi_id?: string;
}

// Type guard to check if an object is a CartItem array
export function isCartItemArray(items: any): items is CartItem[] {
  return Array.isArray(items) && items.length > 0 && 'productId' in items[0];
}

// Helper function to parse JSON items into CartItem[] if needed
export function parseOrderItems(items: any): CartItem[] {
  if (isCartItemArray(items)) {
    return items;
  }
  
  try {
    const parsed = typeof items === 'string' ? JSON.parse(items) : items;
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse order items:", e);
    return [];
  }
}
