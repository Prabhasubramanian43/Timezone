const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const feedbackRoutes = require("./routes/feedback");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");



const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/timezone")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// Login and Register
app.use("/api/auth", authRoutes);

// Feedback
app.use("/api/feedback", feedbackRoutes);

// Products
app.use("/api/products", productRoutes);

// Cart
app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});