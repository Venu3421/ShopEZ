const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const dashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ userType: "customer" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => {
      const discountedPrice = order.price - (order.price * (order.discount || 0)) / 100;
      return acc + discountedPrice * (order.quantity || 1);
    }, 0);

    // Recent orders (last 10)
    const recentOrders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(10);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      recentOrders,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all orders (admin view)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.userType === "admin") {
      return res.status(400).json({ message: "Cannot delete administrative accounts" });
    }
    
    await User.findByIdAndDelete(req.params.id);
    await Cart.findOneAndDelete({ userId: req.params.id });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Toggle block user
// @route   PATCH /api/admin/users/:id/block
// @access  Private/Admin
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.userType === "admin") {
      return res.status(400).json({ message: "Cannot block administrative accounts" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (error) {
    console.error("Block user error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  dashboardStats,
  getAllUsers,
  getAllOrders,
  deleteUser,
  toggleBlockUser,
};
