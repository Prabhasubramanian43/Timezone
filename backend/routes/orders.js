const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");

const router = express.Router();

// POST - Create a new order
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
      !customerName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !address?.trim() ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required order details.",
      });
    }

    // Validate user ID
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    // Prepare products for saving
    const orderProducts = [];

    for (const product of products) {
      const price = Number(product.price);
      const quantity = Number(product.quantity);

      if (
        !product.name ||
        !Number.isFinite(price) ||
        price < 0 ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product details.",
        });
      }

      const orderProduct = {
        name: String(product.name),
        price,
        image: product.image || "",
        quantity,
      };

      /*
       * IMPORTANT:
       * MongoDB product IDs must be valid ObjectIds.
       * Static frontend products may have IDs such as "1" or "watch1".
       * Save productId only when it is a valid MongoDB ObjectId.
       */
      if (
        product.productId &&
        mongoose.isValidObjectId(product.productId)
      ) {
        orderProduct.productId = new mongoose.Types.ObjectId(
          product.productId
        );
      }

      orderProducts.push(orderProduct);
    }

    // Calculate total on the server
    const calculatedTotal = orderProducts.reduce(
      (sum, product) =>
        sum + product.price * product.quantity,
      0
    );

    // Validate submitted total
    if (
      !Number.isFinite(Number(totalAmount)) ||
      Math.abs(Number(totalAmount) - calculatedTotal) > 0.01
    ) {
      return res.status(400).json({
        success: false,
        message: "Order total does not match product details.",
      });
    }

    // Create order
    const order = await Order.create({
      userId,
      customerName: customerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      products: orderProducts,
      totalAmount: calculatedTotal,
      paymentMethod: paymentMethod || "Cash on Delivery",
      orderStatus: "Order Placed",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to place order.",
    });
  }
});

// GET - Get orders for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const orders = await Order.find({ userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
});

module.exports = router;