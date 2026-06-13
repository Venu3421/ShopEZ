const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// @route   GET /api/products
router.get("/", getAllProducts);

// @route   GET /api/products/:id
router.get("/:id", getProductById);

// @route   POST /api/products (Admin only)
router.post("/", authMiddleware, adminMiddleware, createProduct);

// @route   PUT /api/products/:id (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);

// @route   DELETE /api/products/:id (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
