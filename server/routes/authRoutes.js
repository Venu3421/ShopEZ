const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
router.post("/register", register);

// @route   POST /api/auth/login
router.post("/login", login);

// @route   POST /api/auth/logout
router.post("/logout", authMiddleware, logout);

module.exports = router;
