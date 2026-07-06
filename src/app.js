const express = require("express");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/auth.route.js");
const {accountRouter} = require("./routes/account.route.js");
const {transactionRouter} = require("./routes/transaction.route.js");


const app = express();

app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("🏦 Bank Transaction API is running successfully!");
});
app.use("/api/auth", authRouter);
app.use("/api/accounts",accountRouter)
app.use("/api/transactions",transactionRouter)
module.exports = app;



