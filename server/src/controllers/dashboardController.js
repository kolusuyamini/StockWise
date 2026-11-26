const Sale = require("../models/Sale");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalSuppliers,
      productStatsAgg,
      salesAgg,
      completedSalesAgg,
      purchasesAgg,
      monthlySalesAgg,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Supplier.countDocuments({ isActive: { $ne: false } }),
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            inventoryValuation: {
              $sum: { $multiply: ["$costPrice", "$stock"] },
            },
            lowStockCount: {
              $sum: {
                $cond: [{ $lte: ["$stock", "$minStock"] }, 1, 0],
              },
            },
          },
        },
      ]),
      Sale.aggregate([
        { $match: { paymentStatus: { $ne: "cancelled" } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            totalSalesCount: { $sum: 1 },
          },
        },
      ]),
      Sale.aggregate([
        {
          $match: {
            paymentStatus: { $in: ["paid", "completed"] },
          },
        },
        {
          $group: {
            _id: null,
            completedSalesCount: { $sum: 1 },
          },
        },
      ]),
      Purchase.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        {
          $group: {
            _id: null,
            totalPurchaseCost: { $sum: "$totalAmount" },
            totalPurchasesCount: { $sum: 1 },
          },
        },
      ]),
      Sale.aggregate([
        { $match: { paymentStatus: { $ne: "cancelled" } } },
        {
          $group: {
            _id: {
              year: { $year: "$saleDate" },
              month: { $month: "$saleDate" },
            },
            totalSales: { $sum: "$totalAmount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    const inventoryValuation = productStatsAgg[0]?.inventoryValuation || 0;
    const lowStockCount = productStatsAgg[0]?.lowStockCount || 0;
    const totalRevenue = salesAgg[0]?.totalRevenue || 0;
    const totalSalesCount = salesAgg[0]?.totalSalesCount || 0;
    const completedSalesCount = completedSalesAgg[0]?.completedSalesCount || 0;
    const totalPurchaseCost = purchasesAgg[0]?.totalPurchaseCost || 0;
    const totalPurchasesCount = purchasesAgg[0]?.totalPurchasesCount || 0;

    const monthlySales = monthlySalesAgg.map((item) => ({
      month: `${MONTH_NAMES[item._id.month - 1]} ${item._id.year}`,
      totalSales: item.totalSales,
      orders: item.orders,
    }));

    res.json({
      totalProducts,
      totalSuppliers,
      inventoryValuation,
      stockValue: inventoryValuation,
      lowStockCount,
      totalRevenue,
      totalSalesCount,
      totalSales: totalSalesCount,
      completedSalesCount,
      completedSales: completedSalesCount,
      totalPurchaseCost,
      totalPurchasesCount,
      totalPurchases: totalPurchasesCount,
      monthlySales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
