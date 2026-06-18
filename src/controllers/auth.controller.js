const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js");
const emailService = require("../services/email.service.js");
const tokenBlackListModel = require("../models/blacklist.model.js")

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isExists = await userModel.findOne({ email }).select("+password");

    if (isExists) {
      return res.status(409).json({
        status: "failed",
        message: "User already exists with email",
      });
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    await emailService.sendingRegistrationEmail(user.email, user.name);
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        message: "User does not exists with this email",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Password is invalid",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token);

    res.status(200).json({
      status: "success",
      message: "User loggedIn successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split("")[1];

  if (!token) {
    return res.status(400).json({
      message: "Token does not exist ",
    });
  }


  await tokenBlackListModel.create({
    token: token,
  });

  res.clearCookie("token")
  
  res.status(200).json({
    message: "User logged-out successfully",
  });
};
module.exports = { register, login, logout };
