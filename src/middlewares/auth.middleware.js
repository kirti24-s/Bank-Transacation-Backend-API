const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const tokenBlackListModel = require("../models/blacklist.model.js");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided",
      });
    }

    const isBlackListed = await tokenBlackListModel.findOne({ token });

    if (isBlackListed) {
      return res.status(401).json({
        message: "Unauthorized access, token is invalid"
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const systemAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("+systemUser");
    console.log(user);
    if (!user.systemUser) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access, not a system user",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = { authMiddleware, systemAuthMiddleware };
