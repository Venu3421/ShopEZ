const express = require("express");
const router = express.Router();
const {
  dashboardStats,
  getAllUsers,
  getAllOrders,
  deleteUser,
  toggleBlockUser,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// @route   GET /api/admin/dashboard
router.get("/dashboard", authMiddleware, adminMiddleware, dashboardStats);

// @route   GET /api/admin/users
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

// @route   GET /api/admin/orders
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);

// @route   DELETE /api/admin/users/:id
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

// @route   PATCH /api/admin/users/:id/block
router.patch("/users/:id/block", authMiddleware, adminMiddleware, toggleBlockUser);

module.exports = router;
