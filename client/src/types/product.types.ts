
export interface Product {
  _id: string;
  name: string;
  sku: string;
  description?: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  supplier?: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  SKU: string;
  description?: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  supplier?: string;
  image?: string;
}
