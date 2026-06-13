const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.userType === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Access denied. Admin privileges required." });
  }
};

module.exports = adminMiddleware;
