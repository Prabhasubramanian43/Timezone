const express = require("express");
const mongoose = require("mongoose");

const Cart = require("../models/Cart");

const router = express.Router();

// GET - Get user's cart
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        products: [],
      });
    }

    res.json(cart);
  } catch (error) {
    console.log("Get cart error:", error);

    res.status(500).json({
      message: "Unable to get cart",
    });
  }
});

// POST - Add product to cart
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { product } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (
      !product ||
      !mongoose.Types.ObjectId.isValid(product.productId)
    ) {
      return res.status(400).json({
        message: "Valid product ID is required",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [],
      });
    }

    const existingProduct = cart.products.find(
      (item) =>
        item.productId.toString() === product.productId
    );

    if (existingProduct) {
      existingProduct.quantity += product.quantity || 1;
    } else {
      cart.products.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        image: product.image || "",
        brand: product.brand || "TIMEZONE",
        quantity: product.quantity || 1,
      });
    }

    await cart.save();

    res.json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.log("Add cart error:", error);

    res.status(500).json({
      message: "Unable to add product to cart",
    });
  }
});

// PUT - Update product quantity
router.put("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        message: "Invalid user or product ID",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const product = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    product.quantity = quantity;

    await cart.save();

    res.json({
      message: "Quantity updated",
      cart,
    });
  } catch (error) {
    console.log("Update quantity error:", error);

    res.status(500).json({
      message: "Unable to update quantity",
    });
  }
});

// DELETE - Remove product from cart
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        message: "Invalid user or product ID",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    res.json({
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.log("Remove product error:", error);

    res.status(500).json({
      message: "Unable to remove product",
    });
  }
});

module.exports = router;