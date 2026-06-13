const express = require("express");
const router = express.Router();
const {
  getCartByUser,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

// @route   GET /api/cart/:userId
router.get("/:userId", authMiddleware, getCartByUser);

// @route   POST /api/cart
router.post("/", authMiddleware, addToCart);

// @route   PUT /api/cart/:id
router.put("/:id", authMiddleware, updateCartItem);

// @route   DELETE /api/cart/:id
router.delete("/:id", authMiddleware, removeFromCart);

module.exports = router;
