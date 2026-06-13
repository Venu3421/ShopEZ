const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const { category, gender, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Get product error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      mainImg,
      carousel,
      sizes,
      category,
      gender,
      price,
      discount,
      rating,
      stock,
      sizeStock,
    } = req.body;

    let calculatedStock = 0;
    if (sizeStock && typeof sizeStock === 'object') {
      calculatedStock = Object.values(sizeStock).reduce((acc, val) => acc + (Number(val) || 0), 0);
    } else {
      calculatedStock = Number(stock) || 0;
    }

    const product = await Product.create({
      title,
      description,
      mainImg,
      carousel,
      sizes,
      category,
      gender,
      price,
      discount,
      rating: rating ? Number(rating) : 4.5,
      stock: calculatedStock,
      sizeStock: sizeStock || {},
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = { ...req.body };
    if (updateData.sizeStock && typeof updateData.sizeStock === 'object') {
      updateData.stock = Object.values(updateData.sizeStock).reduce((acc, val) => acc + (Number(val) || 0), 0);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
