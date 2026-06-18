const accountModel = require("../models/account.model");

const createAccount = async (req, res) => {
  const user = req.user;

  const account = await accountModel.create({
    user: user._id,
  });
  res.status(201).json({
    success: true,
    message: "Account created successfully",
    account,
  });
};

const getUserAccounts = async (req, res) => {
  const accounts = await accountModel.find({
    user: req.user._id,
  });

  res.status(200).json({
    accounts,
  });
};

const getAccountBalance = async (req, res) => {
  const { accountId } = req.params;

  const account = await accountModel.findById(accountId);

  if (!account) {
    // Fallback: caller might have passed a user id instead of account id
      return res.status(404).json({
        message: "Account not found",
      });
    }

  const balance = await account.getBalance();

  return res.status(200).json({
    accountId: account._id,
    balance: balance,
  });
};
module.exports = { createAccount, getUserAccounts, getAccountBalance };
