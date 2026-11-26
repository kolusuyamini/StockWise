import { useEffect, useState, type FormEvent } from "react";
import {
  getSuppliers,
  createSupplier,
  deleteSupplier,
} from "../../services/supplierService";
import { useAuth } from "../../context/AuthContext";
import type { Supplier } from "../../types/supplier.types";
import PageHeader from "../../components/common/PageHeader";

const SuppliersPage = () => {
  const { user } = useAuth();
  const canManageSuppliers =
    user?.role === "admin" || user?.role === "inventory_manager";
  const canDeleteSuppliers = user?.role === "admin";

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
  });

  const loadSuppliers = async () => {
    try {
      const response = await getSuppliers();
      setSuppliers(response.suppliers || response.data || []);
      setError("");
    } catch {
      setError("Could not load suppliers.");
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canManageSuppliers) return;

    setError("");
    try {
      await createSupplier(form);
      setShowForm(false);
      setForm({ name: "", company: "", email: "", phone: "", city: "" });
      await loadSuppliers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not add supplier.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!canDeleteSuppliers) return;
    if (!window.confirm("Delete this supplier?")) return;

    setError("");
    try {
      await deleteSupplier(id);
      await loadSuppliers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not delete supplier.");
    }
  };

  const colCount = canDeleteSuppliers ? 6 : 5;

  return (
    <div>
      <PageHeader
        title="Suppliers"
        description="Manage your supplier information."
      />

      {canManageSuppliers && (
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="mb-5 rounded-lg bg-blue-600 px-5 py-3 text-white"
        >
          {showForm ? "Close form" : "+ Add Supplier"}
        </button>
      )}

      {error && <p className="mb-4 text-red-600">{error}</p>}

      {canManageSuppliers && showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid gap-3 rounded-xl border bg-white p-5 sm:grid-cols-2"
        >
          <input
            required
            placeholder="Supplier name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border p-3"
          />
          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="rounded-lg border p-3"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border p-3"
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-lg border p-3"
          />
          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="rounded-lg border p-3"
          />
          <button
            type="submit"
            className="rounded-lg bg-green-600 p-3 text-white"
          >
            Save Supplier
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Company</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">City</th>
              {canDeleteSuppliers && <th className="p-4">Action</th>}
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id} className="border-t">
                <td className="p-4">{supplier.name}</td>
                <td className="p-4">{supplier.company || "-"}</td>
                <td className="p-4">{supplier.email || "-"}</td>
                <td className="p-4">{supplier.phone || "-"}</td>
                <td className="p-4">{supplier.city || "-"}</td>
                {canDeleteSuppliers && (
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(supplier._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={colCount} className="p-6 text-center text-slate-500">
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuppliersPage;