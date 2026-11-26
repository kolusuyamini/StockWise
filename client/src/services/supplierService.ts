
import api from "./api";
import type {
  SupplierFormData,
} from "../types/supplier.types";

export const getSuppliers = async () => {
  const response = await api.get("/suppliers");
  return response.data;
};

export const getSupplierById = async (id: string) => {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
};

export const createSupplier = async (data: SupplierFormData) => {
  const response = await api.post("/suppliers", data);
  return response.data;
};

export const updateSupplier = async (
  id: string,
  data: Partial<SupplierFormData>
) => {
  const response = await api.put(`/suppliers/${id}`, data);
  return response.data;
};

export const deleteSupplier = async (id: string) => {
  const response = await api.delete(`/suppliers/${id}`);
  return response.data;
};
