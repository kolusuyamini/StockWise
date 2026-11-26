
export type PaymentMethod =
  | "cash"
  | "card"
  | "upi"
  | "other";

export type PaymentStatus =
  | "paid"
  | "pending";

export interface SaleItem {
  product: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  _id: string;
  invoiceNumber: string;
  customerName?: string;
  customerPhone?: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  saleDate: string;
  soldBy?: string;
}

export interface SaleFormData {
  customerName?: string;
  customerPhone?: string;
  items: {
    product: string;
    quantity: number;
    unitPrice: number;
  }[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}
