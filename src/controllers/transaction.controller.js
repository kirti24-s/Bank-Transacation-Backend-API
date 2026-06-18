const mongoose = require("mongoose");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");
const emailService = require("../services/email.service");

/**
 * 
 * NORMAL USER → MONEY TRANSFER
 * 
 */

const createTransaction = async (req, res) => {
  let session;
  let committed = false;

  try {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
      return res.status(400).json({
        success: false,
        message:
          "fromAccount, toAccount, amount and idempotencyKey are required",
      });
    }

    const existingTransaction = await transactionModel.findOne({
      idempotencyKey,
    });

    if (existingTransaction) {
      if (existingTransaction.status === "COMPLETED") {
        return res.status(409).json({
          success: false,
          message: "Transaction already completed",
        });
      }

      if (existingTransaction.status === "PENDING") {
        return res.status(409).json({
          success: false,
          message: "Transaction already pending",
        });
      }
    }

    const fromUserAccount = await accountModel.findById(fromAccount);
    if (!fromUserAccount) {
      return res.status(400).json({
        success: false,
        message: "Invalid fromAccount",
      });
    }

    const toUserAccount = await accountModel.findById(toAccount);
    if (!toUserAccount) {
      return res.status(400).json({
        success: false,
        message: "Invalid toAccount",
      });
    }

    if (
      fromUserAccount.status !== "ACTIVE" ||
      toUserAccount.status !== "ACTIVE"
    ) {
      return res.status(400).json({
        success: false,
        message: "Both accounts must be ACTIVE",
      });
    }

    const senderUser = await userModel.findById(fromUserAccount.user);
    const receiverUser = await userModel.findById(toUserAccount.user);

    if (!senderUser || !receiverUser) {
      return res.status(400).json({
        success: false,
        message: "Unable to resolve sender or receiver user for the accounts",
      });
    }

    const balance = await fromUserAccount.getBalance();
    if (balance < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Current balance is ${balance}`,
      });
    }

    let createdTransaction;
    let debitLedgerEntry;
    let creditLedgerEntry;

    createdTransaction = await transactionModel.create({
      fromAccount: fromUserAccount._id,
      toAccount: toUserAccount._id,
      amount: Number(amount),
      idempotencyKey,
      status: "PENDING",
    });

    session = await mongoose.startSession();
    session.startTransaction();

    try {
      [debitLedgerEntry] = await ledgerModel.create(
        [
          {
            account: fromUserAccount._id,
            amount: Number(amount),
            transaction: createdTransaction._id,
            type: "DEBIT",
          },
        ],
        { session },
      );

      await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

      [creditLedgerEntry] = await ledgerModel.create(
        [
          {
            account: toUserAccount._id,
            amount: Number(amount),
            transaction: createdTransaction._id,
            type: "CREDIT",
          },
        ],
        { session },
      );

      await transactionModel.findOneAndUpdate(
        { _id: createdTransaction._id },
        { status: "COMPLETED" },
        { session },
      );
      createdTransaction.status = "COMPLETED";

      await session.commitTransaction();
      committed = true;
    } catch (err) {
      if (session && !committed) {
        await session.abortTransaction();
      }

      await transactionModel.findOneAndUpdate(
        { idempotencyKey },
        { status: "FAILED" },
      );

      try {
        await emailService.sendTransactionFailureEmail(
          req.user.email,
          req.user.name,
          amount,
          toAccount,
        );
      } catch (emailErr) {
        console.error(
          "Failed to send transaction failure email:",
          emailErr.message || emailErr,
        );
      }

      return res.status(500).json({
        message:
          "Transaction failed due to an unexpected issue. Please retry after some time.",
        error: err.message,
      });
    }
    try {
      await Promise.all([
        emailService.sendTransactionSuccessEmail(
          senderUser.email,
          senderUser.name,
          amount,
          toAccount,
          fromAccount,
        )
      ]);
    } catch (emailErr) {
      console.error(
        "Failed to send transaction notification emails:",
        emailErr.message || emailErr,
      );
    }

    return res.status(201).json({
      success: true,
      message: "Transaction completed successfully",
      transaction: createdTransaction,
      debitLedgerEntry,
      creditLedgerEntry,
    });
  } catch (error) {
    if (session && !committed) await session.abortTransaction();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    if (session) session.endSession();
  }
};

/**
 * 
 * SYSTEM → USER INITIAL FUNDING
 *
 */
const createInitialFundsTransaction = async (req, res) => {
  let session;

  try {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
      return res.status(400).json({
        success: false,
        message: "toAccount, amount and idempotencyKey are required",
      });
    }

    const existingTransaction = await transactionModel.findOne({
      idempotencyKey,
    });

    if (existingTransaction) {
      return res.status(409).json({
        success: false,
        message: "Transaction already exists",
      });
    }

    // Ensure the system user has a dedicated system account
    let systemAccount = await accountModel
      .findOne({
        user: req.user._id,
        systemUser: true,
      })
      .select("+systemUser");

    if (!systemAccount) {
      return res.status(400).json({
        success: false,
        message: "System account not found",
      });
    }

    const toUserAccount = await accountModel.findById(toAccount);

    if (!toUserAccount) {
      return res.status(400).json({
        success: false,
        message: "Recipient account not found",
      });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const [createdTransaction] = await transactionModel.create(
      [
        {
          fromAccount: systemAccount._id,
          toAccount: toUserAccount._id,
          amount: Number(amount),
          idempotencyKey,
          status: "PENDING",
        },
      ],
      { session },
    );

    const [debitLedgerEntry] = await ledgerModel.create(
      [
        {
          account: systemAccount._id,
          amount: Number(amount),
          transaction: createdTransaction._id,
          type: "DEBIT",
        },
      ],
      { session },
    );

    const [creditLedgerEntry] = await ledgerModel.create(
      [
        {
          account: toUserAccount._id,
          amount: Number(amount),
          transaction: createdTransaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    createdTransaction.status = "COMPLETED";
    await createdTransaction.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Initial funds transferred successfully",
      transaction: createdTransaction,
      debitLedgerEntry,
      creditLedgerEntry,
    });
  } catch (error) {
    if (session) await session.abortTransaction();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    if (session) session.endSession();
  }
};

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
};
