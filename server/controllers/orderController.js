const Order = require("../models/Order");

// @desc    Get all orders (admin) or orders by user
// @route   GET /api/orders
// @access  Private
const getAllOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    let filter = {};

    if (userId) filter.userId = userId;

    const orders = await Order.find(filter).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Get order error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      productId,
      name,
      email,
      mobile,
      address,
      pincode,
      title,
      description,
      mainImg,
      size,
      quantity,
      price,
      discount,
      paymentMethod,
      deliveryDate,
    } = req.body;

    const order = await Order.create({
      userId,
      productId,
      name,
      email,
      mobile,
      address,
      pincode,
      title,
      description,
      mainImg,
      size,
      quantity: quantity || 1,
      price,
      discount,
      paymentMethod,
      orderDate: Date.now(),
      deliveryDate,
      orderStatus: "order placed",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedOrder);
  } catch (error) {
    console.error("Update order error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
