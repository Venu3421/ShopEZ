const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// @route   GET /api/orders
router.get("/", authMiddleware, getAllOrders);

// @route   GET /api/orders/:id
router.get("/:id", authMiddleware, getOrderById);

// @route   POST /api/orders
router.post("/", authMiddleware, createOrder);

// @route   PUT /api/orders/:id (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, updateOrderStatus);

// @route   DELETE /api/orders/:id (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteOrder);

module.exports = router;
