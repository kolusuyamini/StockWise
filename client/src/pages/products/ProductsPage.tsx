import { useEffect, useState, type FormEvent } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../../services/productService";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/common/PageHeader";

interface ProductItem {
  _id: string;
  name: string;
  sku?: string;
  category?: string;
  costPrice?: number;
  sellingPrice?: number;
  price?: number;
  stock?: number;
  quantity?: number;
  isActive?: boolean;
}

const ProductsPage = () => {
  const { user } = useAuth();
  const canManageProducts =
    user?.role === "admin" || user?.role === "inventory_manager";
  const canDeleteProducts = user?.role === "admin";

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [stock, setStock] = useState(0);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      const list = res.products || res.data || (Array.isArray(res) ? res : []);
      setProducts(list);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not load products.");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!canManageProducts) return;

    setError("");
    setSubmitting(true);
    try {
      await createProduct({
        name: name.trim(),
        SKU: sku.trim(),
        category: category.trim(),
        costPrice: Number(costPrice),
        price: Number(sellingPrice),
        stock: Number(stock),
        minStock: 0,
      });

      setName("");
      setSku("");
      setCategory("");
      setCostPrice(0);
      setSellingPrice(0);
      setStock(0);
      setShowForm(false);
      await loadProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not create product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!canDeleteProducts) return;

    setError("");
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not delete product.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description="View product catalog and current stock levels."
      />

      {canManageProducts && (
        <div className="mb-5 flex justify-end">
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            {showForm ? "Close form" : "+ Add Product"}
          </button>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {canManageProducts && showForm && (
        <form
          onSubmit={handleCreateProduct}
          className="mb-6 grid gap-3 rounded-xl border bg-white p-5 sm:grid-cols-2 lg:grid-cols-6"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Product Name
            </label>
            <input
              required
              placeholder="e.g. Wireless Mouse"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              SKU
            </label>
            <input
              placeholder="e.g. SKU-101"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Category
            </label>
            <input
              placeholder="e.g. Accessories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Cost Price (₹)
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

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Selling Price (₹)
            </label>
            <input
              required
              type="number"
              min={0}
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="flex flex-col justify-between gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Opening Stock
              </label>
              <input
                required
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          <div className="flex justify-end sm:col-span-2 lg:col-span-6">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Cost Price</th>
              <th className="p-4">Selling Price</th>
              <th className="p-4">Stock</th>
              {canDeleteProducts && <th className="p-4">Action</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const displayPrice = product.sellingPrice ?? product.price ?? 0;
              const displayStock = product.stock ?? product.quantity ?? 0;

              return (
                <tr key={product._id} className="border-t">
                  <td className="p-4 font-medium text-slate-800">
                    {product.name}
                  </td>
                  <td className="p-4">{product.sku || "-"}</td>
                  <td className="p-4">₹{product.costPrice ?? 0}</td>
                  <td className="p-4">₹{displayPrice}</td>
                  <td className="p-4">{displayStock}</td>
                  {canDeleteProducts && (
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product._id)}
                        className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={canDeleteProducts ? 6 : 5}
                  className="p-6 text-center text-slate-500"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;