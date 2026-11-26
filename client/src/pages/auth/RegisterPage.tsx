import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types/auth.types";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("sales_staff");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({ name, email, password, role });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">Create Account</h1>
        <p className="mb-6 text-center text-sm text-slate-500">Join StockWise</p>

        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <label className="mb-2 block text-sm font-medium">Full name</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mb-4 w-full rounded-lg border p-3" />

        <label className="mb-2 block text-sm font-medium">Email address</label>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="mb-4 w-full rounded-lg border p-3" />

        <label className="mb-2 block text-sm font-medium">Password</label>
        <input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="mb-4 w-full rounded-lg border p-3" />

        <label className="mb-2 block text-sm font-medium">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="mb-5 w-full rounded-lg border bg-white p-3"
        >
          <option value="admin">Admin</option>
          <option value="inventory_manager">Inventory Manager</option>
          <option value="sales_staff">Sales Staff</option>
        </select>

        <button disabled={loading} className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already registered? <Link to="/login" className="font-semibold text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;