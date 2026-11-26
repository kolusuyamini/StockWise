
import api from "./api";
import type { ProductFormData } from "../types/product.types";

export const getProducts = async (params?: {
  search?: string;
  category?: string;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: ProductFormData) => {
  const response = await api.post("/products", data);
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: Partial<ProductFormData>
) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
