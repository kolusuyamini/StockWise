import { useEffect, useState } from "react";
import { Package, Truck, ShoppingCart, Receipt, AlertTriangle } from "lucide-react";
import { getDashboardStats } from "../../services/dashboardService";
import StatCard from "../../components/common/StatCard";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const DashboardPage = () => {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then((response) => setStats(response.data || response))
      .catch(() => setError("Unable to load dashboard information."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const summary = stats.statistics || stats;

  const currency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Here's an overview of your inventory business."
      />

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={summary.totalProducts ?? 0}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Total Suppliers"
          value={summary.totalSuppliers ?? 0}
          icon={Truck}
          color="green"
        />
        <StatCard
          title="Total Purchases"
          value={summary.totalPurchases ?? 0}
          icon={ShoppingCart}
          color="purple"
        />
        <StatCard
          title="Total Sales"
          value={summary.totalSales ?? 0}
          icon={Receipt}
          color="orange"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-800">Inventory valuation</h2>
          <p className="mt-3 text-3xl font-bold text-blue-600">
            {currency(summary.stockValue ?? summary.stockValuation ?? 0)}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Total value of available inventory
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-orange-500" />
            <h2 className="font-semibold text-slate-800">Low stock products</h2>
          </div>
          <p className="mt-3 text-3xl font-bold text-orange-500">
            {summary.lowStockProducts ??
              summary.lowStockCount ??
              stats.lowStock?.length ??
              0}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Products that need restocking
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;