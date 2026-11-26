
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Boxes } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <Boxes className="mx-auto mb-3 text-blue-600" size={42} />
          <h1 className="text-3xl font-bold text-slate-800">StockWise</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to manage your inventory</p>
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <label className="mb-2 block text-sm font-medium">Email address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="mb-4 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
        />

        <label className="mb-2 block text-sm font-medium">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="mb-5 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
        />

        <button disabled={loading} className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="font-semibold text-blue-600">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
