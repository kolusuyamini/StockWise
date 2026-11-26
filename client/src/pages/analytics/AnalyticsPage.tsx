import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getDashboardStats } from "../../services/dashboardService";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const AnalyticsPage = () => {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then((response) => setStats(response.data || response))
      .catch(() => setError("Could not load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const summary = stats.statistics || stats;
  const rawMonthlySales = stats.monthlySales || [];

  const monthlySales = rawMonthlySales.map((item: any) => {
    const monthIndex =
      typeof item._id?.month === "number" ? item._id.month - 1 : -1;
    const year = item._id?.year ?? "";
    const monthLabel =
      item.month ||
      (monthIndex >= 0 && monthIndex < 12
        ? `${MONTH_NAMES[monthIndex]} ${year}`.trim()
        : `Month ${item._id?.month ?? ""}`);

    return {
      month: monthLabel,
      revenue: Number(item.revenue ?? item.totalSales ?? 0),
      orders: Number(item.orders ?? 0),
    };
  });

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Understand your business performance."
      />

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Revenue</p>
          <p className="mt-2 text-2xl font-semibold text-slate-800">
            ₹{summary.totalRevenue ?? 0}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Stock Value</p>
          <p className="mt-2 text-2xl font-semibold text-slate-800">
            ₹{summary.stockValue ?? 0}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Active Products</p>
          <p className="mt-2 text-2xl font-semibold text-slate-800">
            {summary.totalProducts ?? 0}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Completed Sales</p>
          <p className="mt-2 text-2xl font-semibold text-slate-800">
            {summary.totalSales ?? 0}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 font-semibold text-slate-800">Monthly sales</h2>
        <div className="h-80 w-full">
          {monthlySales.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`₹${value}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#2563eb" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">
              No monthly sales data available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;