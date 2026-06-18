const express = require("express");
const authRouter = express.Router();
const { register, login, logout } = require("../controllers/auth.controller.js");

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout",logout)
module.exports = { authRouter };
