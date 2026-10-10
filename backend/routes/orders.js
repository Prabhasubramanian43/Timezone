const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");

const router = express.Router();

// Create new order
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      customerName,
      email,
      phone,
      address,
      products,
      totalAmount,
      paymentMethod,
    } = req.body;

    // Validate required details
    if (
      !userId ||
      !customerName ||
      !email ||
      !phone ||
      !address ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        message: "Please provide all required order details.",
      });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    // Validate products
    for (const product of products) {
      if (
        !product.name ||
        !Number.isFinite(Number(product.price)) ||
        Number(product.price) < 0 ||
        !Number.isInteger(Number(product.quantity)) ||
        Number(product.quantity) < 1
      ) {
        return res.status(400).json({
          message: "Invalid product details.",
        });
      }

      if (
        product.productId &&
        !mongoose.isValidObjectId(product.productId)
      ) {
        return res.status(400).json({
          message: "Invalid product ID.",
        });
      }
    }

    // Calculate total from submitted product prices and quantities
    const calculatedTotal = products.reduce(
      (sum, product) =>
        sum + Number(product.price) * Number(product.quantity),
      0
    );

    if (
      !Number.isFinite(Number(totalAmount)) ||
      Number(totalAmount) !== calculatedTotal
    ) {
      return res.status(400).json({
        message: "Order total does not match product details.",
      });
    }

    // Save order in MongoDB
    const order = await Order.create({
      userId,
      customerName,
      email,
      phone,
      address,
      products,
      totalAmount: calculatedTotal,
      paymentMethod: paymentMethod || "Cash on Delivery",
      orderStatus: "Order Placed",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Unable to place order.",
    });
  }
});

// Get orders for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    const orders = await Order.find({ userId }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Unable to fetch orders.",
    });
  }
});

module.exports = router;