
import { Product } from "../types";

export const products: Product[] = [
  {
    id: "1",
    name: "Monstera Deliciosa",
    price: 29.99,
    description: "The Swiss Cheese Plant, known for its dramatic leaf holes, is a perfect statement plant for any room.",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "indoor",
    careLevel: "easy",
    lightNeeds: "medium",
    waterNeeds: "medium",
    petFriendly: false,
    stock: 15
  },
  {
    id: "2",
    name: "Snake Plant",
    price: 19.99,
    description: "One of the most tolerant houseplants, perfect for beginners. It thrives in almost any light condition.",
    imageUrl: "https://images.unsplash.com/photo-1572688484438-313a6e50c333?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "indoor",
    careLevel: "easy",
    lightNeeds: "low",
    waterNeeds: "low",
    petFriendly: false,
    stock: 20
  },
  {
    id: "3",
    name: "Fiddle Leaf Fig",
    price: 49.99,
    description: "This trendy houseplant features large, violin-shaped leaves that provide a striking focal point.",
    imageUrl: "https://images.unsplash.com/photo-1596438459194-f275f413d6ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "indoor",
    careLevel: "hard",
    lightNeeds: "high",
    waterNeeds: "medium",
    petFriendly: false,
    stock: 8
  },
  {
    id: "4",
    name: "Peace Lily",
    price: 24.99,
    description: "The Peace Lily is an easy-care plant with elegant white flowers and glossy leaves.",
    imageUrl: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "indoor",
    careLevel: "medium",
    lightNeeds: "low",
    waterNeeds: "medium",
    petFriendly: false,
    stock: 12
  },
  {
    id: "5",
    name: "Pothos",
    price: 14.99,
    description: "An incredibly versatile trailing plant that can thrive in a variety of conditions.",
    imageUrl: "https://images.unsplash.com/photo-1611211232932-da3113c5b960?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "indoor",
    careLevel: "easy",
    lightNeeds: "low",
    waterNeeds: "low",
    petFriendly: false,
    stock: 25
  },
  {
    id: "6",
    name: "Aloe Vera",
    price: 16.99,
    description: "A succulent with healing properties, perfect for sunny kitchen windowsills.",
    imageUrl: "https://images.unsplash.com/photo-1596397249129-ef2c1e0654cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "succulents",
    careLevel: "easy",
    lightNeeds: "high",
    waterNeeds: "low",
    petFriendly: false,
    stock: 18
  },
  {
    id: "7",
    name: "Boston Fern",
    price: 22.99,
    description: "This lush fern adds a touch of elegance with its arching fronds and feathery foliage.",
    imageUrl: "https://images.unsplash.com/photo-1597305275283-fac980cf18e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "indoor",
    careLevel: "medium",
    lightNeeds: "medium",
    waterNeeds: "high",
    petFriendly: true,
    stock: 10
  },
  {
    id: "8",
    name: "Spider Plant",
    price: 15.99,
    description: "A classic houseplant with arching leaves and tiny plantlets that hang from long stems.",
    imageUrl: "https://images.unsplash.com/photo-1572686972466-93a404a88424?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "indoor",
    careLevel: "easy",
    lightNeeds: "medium",
    waterNeeds: "medium",
    petFriendly: true,
    stock: 22
  }
];

export const categories = [
  { id: "1", name: "All Plants" },
  { id: "2", name: "Indoor" },
  { id: "3", name: "Outdoor" },
  { id: "4", name: "Succulents" },
  { id: "5", name: "Tropical" },
  { id: "6", name: "Pet-Friendly" }
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All Plants") return products;
  if (category === "Pet-Friendly") return products.filter(product => product.petFriendly);
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
}
