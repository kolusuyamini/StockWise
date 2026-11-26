require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const supplierRoutes = require("./src/routes/supplierRoutes");
const purchaseRoutes = require("./src/routes/purchaseRoutes");
const saleRoutes = require("./src/routes/saleRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

const app = express();

// Allow frontend development ports
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Thunder Client, Postman, or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const err = new Error(`Origin ${origin} not allowed by CORS`);
      err.status = 403;
      callback(err);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// CORS middleware (handles preflight OPTIONS automatically)
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to StockWise API",
    status: "Running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "StockWise API is healthy",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log("--------------------------------");
      console.log("StockWise Backend Started");
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Frontend: ${allowedOrigins.join(", ")}`);
      console.log("--------------------------------");
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();