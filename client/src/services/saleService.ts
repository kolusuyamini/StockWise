
import api from "./api";
import type { SaleFormData } from "../types/sale.types";

export const getSales = async () => {
  const response = await api.get("/sales");
  return response.data;
};

export const getSaleById = async (id: string) => {
  const response = await api.get(`/sales/${id}`);
  return response.data;
};

export const createSale = async (data: SaleFormData) => {
  const response = await api.post("/sales", data);
  return response.data;
};
