import { useEffect, useState, type FormEvent } from "react";
import { getSales, createSale } from "../../services/saleService";
import { getProducts } from "../../services/productService";
import type { PaymentMethod, Sale } from "../../types/sale.types";
import PageHeader from "../../components/common/PageHeader";

interface ProductOption {
  _id: string;
  name: string;
  sku?: string;
  price?: number;
  stock?: number;
}

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  const loadData = async () => {
    try {
      const [salesRes, productsRes] = await Promise.all([
        getSales(),
        getProducts(),
      ]);

      const salesList = salesRes.sales || salesRes.data || [];
      const productList = productsRes.products || productsRes.data || [];

      setSales(salesList);
      setProducts(productList);

      if (!productId && productList.length > 0) {
        setProductId(productList[0]._id);
      }

      setError("");
    } catch {
      setError("Could not load sales data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedProduct = products.find((p) => p._id === productId);
  const unitPrice = Number(selectedProduct?.price) || 0;
  const estimatedTotal = unitPrice * Math.max(1, Number(quantity) || 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!productId) {
      setError("Please select a product.");
      return;
    }

    setSubmitting(true);
    try {
      await createSale({
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        items: [
          {
            product: productId,
            quantity: Number(quantity),
            unitPrice,
          },
        ],
        paymentMethod,
        paymentStatus: "paid",
      });

      setShowForm(false);
      setCustomerName("");
      setCustomerPhone("");
      setQuantity(1);
      setPaymentMethod("cash");
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not create sale.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Sales"
        description="View customer sales and invoices."
      />

      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          {showForm ? "Close form" : "+ Add Sale"}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid gap-3 rounded-xl border bg-white p-5 sm:grid-cols-2 lg:grid-cols-5"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Customer Name
            </label>
            <input
              placeholder="Walk-in Customer"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Customer Phone
            </label>
            <input
              placeholder="Optional phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Product
            </label>
            <select
              required
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-lg border bg-white p-3"
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} (Stock: {p.stock ?? 0}, ₹{p.price ?? 0})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Quantity
            </label>
            <input
              required
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full rounded-lg border bg-white p-3"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm sm:col-span-2 lg:col-span-4">
            <span className="text-slate-600">
              Unit Price: <strong>₹{unitPrice}</strong>
            </span>
            <span className="text-slate-800">
              Total Amount: <strong>₹{estimatedTotal}</strong>
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-green-600 p-3 font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Sale"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Invoice No.</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id} className="border-t">
                <td className="p-4">{sale.invoiceNumber}</td>
                <td className="p-4">
                  {sale.customerName || "Walk-in customer"}
                </td>
                <td className="p-4">
                  {new Date(sale.saleDate).toLocaleDateString()}
                </td>
                <td className="p-4">₹{sale.totalAmount}</td>
                <td className="p-4 uppercase">{sale.paymentMethod}</td>
                <td className="p-4 capitalize">{sale.paymentStatus}</td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  No sales found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesPage;