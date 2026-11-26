import { useEffect, useState, type FormEvent } from "react";
import { getPurchases, createPurchase } from "../../services/purchaseService";
import { getSuppliers } from "../../services/supplierService";
import { getProducts } from "../../services/productService";
import { useAuth } from "../../context/AuthContext";
import type { Purchase } from "../../types/purchase.types";
import PageHeader from "../../components/common/PageHeader";

interface SupplierOption {
  _id: string;
  name: string;
  company?: string;
}

interface ProductOption {
  _id: string;
  name: string;
  sku?: string;
  costPrice?: number;
}

const PurchasesPage = () => {
  const { user } = useAuth();
  const canCreatePurchase =
    user?.role === "admin" || user?.role === "inventory_manager";

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [supplierId, setSupplierId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [costPrice, setCostPrice] = useState(0);
  const [notes, setNotes] = useState("");

  const loadData = async () => {
    try {
      const [purchaseRes, supplierRes, productRes] = await Promise.all([
        getPurchases(),
        getSuppliers(),
        getProducts(),
      ]);

      const purchaseList = purchaseRes.purchases || purchaseRes.data || [];
      const supplierList = supplierRes.suppliers || supplierRes.data || [];
      const productList = productRes.products || productRes.data || [];

      setPurchases(purchaseList);
      setSuppliers(supplierList);
      setProducts(productList);

      if (!supplierId && supplierList.length > 0) {
        setSupplierId(supplierList[0]._id);
      }

      if (!productId && productList.length > 0) {
        setProductId(productList[0]._id);
        setCostPrice(Number(productList[0].costPrice) || 0);
      }

      setError("");
    } catch {
      setError("Could not load purchases data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProductChange = (selectedId: string) => {
    setProductId(selectedId);
    const found = products.find((p) => p._id === selectedId);
    if (found && typeof found.costPrice === "number") {
      setCostPrice(found.costPrice);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canCreatePurchase) return;

    setError("");

    if (!supplierId || !productId) {
      setError("Please select both a supplier and a product.");
      return;
    }

    setSubmitting(true);
    try {
      await createPurchase({
        supplier: supplierId,
        items: [
          {
            product: productId,
            quantity: Number(quantity),
            costPrice: Number(costPrice),
          },
        ],
        notes: notes.trim(),
      });

      setShowForm(false);
      setQuantity(1);
      setNotes("");
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not create purchase.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Purchases"
        description="View purchases made from your suppliers."
      />

      {canCreatePurchase && (
        <div className="mb-5 flex justify-end">
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            {showForm ? "Close form" : "+ Add Purchase"}
          </button>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {canCreatePurchase && showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid gap-3 rounded-xl border bg-white p-5 sm:grid-cols-2 lg:grid-cols-5"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Supplier
            </label>
            <select
              required
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full rounded-lg border bg-white p-3"
            >
              <option value="">Select supplier</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} {s.company ? `(${s.company})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Product
            </label>
            <select
              required
              value={productId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full rounded-lg border bg-white p-3"
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} {p.sku ? `[${p.sku}]` : ""}
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
              Unit Cost Price (₹)
            </label>
            <input
              required
              type="number"
              min={0}
              value={costPrice}
              onChange={(e) => setCostPrice(Number(e.target.value))}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-green-600 p-3 font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Purchase"}
            </button>
          </div>

          <div className="sm:col-span-2 lg:col-span-5">
            <input
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Purchase No.</th>
              <th className="p-4">Supplier</th>
              <th className="p-4">Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase._id} className="border-t">
                <td className="p-4">{purchase.purchaseNumber}</td>
                <td className="p-4">
                  {typeof purchase.supplier === "string"
                    ? purchase.supplier
                    : (purchase.supplier as any)?.name || "-"}
                </td>
                <td className="p-4">
                  {new Date(purchase.purchaseDate).toLocaleDateString()}
                </td>
                <td className="p-4">₹{purchase.totalAmount}</td>
                <td className="p-4 capitalize">{purchase.status}</td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  No purchases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasesPage;