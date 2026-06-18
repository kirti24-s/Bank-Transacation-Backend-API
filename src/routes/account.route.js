const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  createAccount,
  getUserAccounts,
  getAccountBalance,
} = require("../controllers/account.controller");

const accountRouter = express.Router();

accountRouter.post("/", authMiddleware, createAccount);
accountRouter.post("/all", authMiddleware, getUserAccounts);
accountRouter.get("/balance/:accountId", authMiddleware, getAccountBalance);

module.exports = { accountRouter };
