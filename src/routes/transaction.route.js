const express = require('express');
const { authMiddleware, systemAuthMiddleware } = require('../middlewares/auth.middleware.js');
const { createTransaction,createInitialFundsTransaction } = require('../controllers/transaction.controller.js');

const transactionRouter = express.Router();

transactionRouter.post('/', authMiddleware, createTransaction);
transactionRouter.post('/system/initial-funds',systemAuthMiddleware,createInitialFundsTransaction)
module.exports = { transactionRouter };


