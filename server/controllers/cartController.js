const Cart = require("../models/Cart");

// @desc    Get cart items by user ID
// @route   GET /api/cart/:userId
// @access  Private
const getCartByUser = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId });
    res.json(cartItems);
  } catch (error) {
    console.error("Get cart error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { userId, productId, title, description, mainImg, size, quantity, price, discount } =
      req.body;

    const cartItem = await Cart.create({
      userId,
      productId,
      title,
      description,
      mainImg,
      size,
      quantity: quantity || 1,
      price,
      discount,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update cart item (e.g., quantity, size)
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const updatedItem = await Cart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedItem);
  } catch (error) {
    console.error("Update cart error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Remove from cart error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getCartByUser,
  addToCart,
  updateCartItem,
  removeFromCart,
};
