require("dotenv").config();
const express = require("express");
const app = require('./src/app.js');
const connectDB = require("./src/config/db.js");
const {PORT} = require("./src/config/config.js");

connectDB();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


