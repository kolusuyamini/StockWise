
export type PurchaseStatus =
  | "pending"
  | "received"
  | "cancelled";

export interface PurchaseItem {
  product: string;
  quantity: number;
  costPrice: number;
  subtotal: number;
}

export interface Purchase {
  _id: string;
  purchaseNumber: string;
  supplier: string;
  items: PurchaseItem[];
  totalAmount: number;
  status: PurchaseStatus;
  purchaseDate: string;
  notes?: string;
  createdBy?: string;
}

export interface PurchaseFormData {
  supplier: string;
  items: {
    product: string;
    quantity: number;
    costPrice: number;
  }[];
  notes?: string;
}
