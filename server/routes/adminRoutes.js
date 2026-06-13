const express = require("express");
const router = express.Router();
const {
  dashboardStats,
  getAllUsers,
  getAllOrders,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// @route   GET /api/admin/dashboard
router.get("/dashboard", authMiddleware, adminMiddleware, dashboardStats);

// @route   GET /api/admin/users
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

// @route   GET /api/admin/orders
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);

module.exports = router;
