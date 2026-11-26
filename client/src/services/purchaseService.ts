
import api from "./api";
import type { PurchaseFormData } from "../types/purchase.types";

export const getPurchases = async () => {
  const response = await api.get("/purchases");
  return response.data;
};

export const getPurchaseById = async (id: string) => {
  const response = await api.get(`/purchases/${id}`);
  return response.data;
};

export const createPurchase = async (data: PurchaseFormData) => {
  const response = await api.post("/purchases", data);
  return response.data;
};
