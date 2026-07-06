# 🏦 Bank Transaction Backend API

A secure and scalable **Bank Transaction Backend API** built with **Node.js**, **Express.js**, and **JavaScript** that simulates real-world banking operations. The project implements authentication, account management, secure money transfers, email notifications, token blacklisting, and idempotent transactions while following clean backend architecture.



## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Secure Password Hashing
- Logout with Token Blacklisting

### 🏦 Bank Account Management
- Create Bank Account
- View All User Accounts
- Check Account Balance
- Multiple Accounts Per User

### 💸 Secure Transactions
- Transfer Money Between Accounts
- Automatic Balance Updates
- System Bank Account for Initial Funding
- Transaction Validation
- Duplicate Transaction Prevention

### ⚙️ Idempotency Support
- Prevents duplicate money transfers
- Safe retry mechanism using **Idempotency Keys**
- Ensures transaction consistency

### 📩 Email Notifications
- Welcome Email after Registration
- Transaction Confirmation Emails
- Account Activity Notifications

### 🛡️ Security
- JWT Authentication
- Password Encryption (bcrypt)
- Token Blacklisting
- Input Validation
- Error Handling
- Protected API Routes



# 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime Environment |
| Express.js | Backend Framework |
| JavaScript (ES6+) | Programming Language |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Nodemailer | Email Service |
| dotenv | Environment Variables |



Project Tree
- package.json
- server.js
- src/
  - app.js
  - config/
    - config.js
    - db.js
  - controllers/
    - account.controller.js
    - auth.controller.js
    - beneficiary.controller.js
    - transaction.controller.js
  - middlewares/
    - auth.middleware.js
  - models/
    - account.model.js
    - beneficiary.model.js
    - blacklist.model.js
    - ledger.model.js
    - transaction.model.js
    - user.model.js
  - routes/
    - account.route.js
    - auth.route.js
    - beneficiary.route.js
    - transaction.route.js
  - services/
    - email.service.js


# ✨ Core Functionalities

## 👤 User Authentication

- Register a new user
- Login securely
- Generate JWT Token
- Logout
- Token Blacklisting



## 🏦 Bank Accounts

- Create Bank Account
- View User Accounts
- Get Account Balance
- Automatic Initial Deposit



## 💰 Transactions

- Transfer Money
- Validate Sender & Receiver
- Update Balances
- Transaction History Ready Architecture



## 🔁 Idempotent Transactions

This project implements an **Idempotency Key** mechanism.

If the same transaction request is accidentally submitted multiple times:

- ✅ Only one transaction is processed
- ✅ Duplicate transfers are prevented
- ✅ Safe retries are supported

This is a common pattern used in real-world payment gateways and banking systems.



## 📧 Email Notifications

Users receive email notifications for:

- 🎉 Successful Registration
- 💸 Successful Money Transfer



## 🔒 Security Features

- JWT Authentication
- Password Hashing with bcrypt
- Protected Routes
- Token Blacklisting
- Input Validation
- Environment Variables
- Secure Error Responses



# 📡 API Endpoints

## Authentication

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| POST | `/api/auth/logout` | Logout User |



## Accounts

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | `/api/accounts/create` | Create Bank Account |
| GET | `/api/accounts` | Get User Accounts |
| GET | `/api/accounts/:id/balance` | Get Account Balance |



## Transactions

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | `/api/transactions/transfer` | Transfer Money |


# ⚡ Getting Started

## Clone Repository

bash
git clone https://github.com/yourusername/bank-transaction-api.git


bash
cd bank-transaction-api



## Install Dependencies

bash
npm install




## Create Environment File

Create a `.env` file in the root directory.

Example:

env
PORT=5000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASS=your_password



## Start Development Server

bash
npm run dev




## Production

bash
npm start


# 🧪 API Testing

The API has been tested using:

- ✅ Postman
- JWT Authentication
- Protected Routes
- Money Transfers
- Duplicate Transaction Prevention
- Email Notifications



# 📈 Future Improvements

- Transaction History
- Admin Dashboard
- Account Statements
- OTP Verification
- Rate Limiting
- Swagger API Documentation
- Docker Support
- Unit & Integration Testing
- Refresh Tokens
- Role-Based Access Control (RBAC)



# 🎯 Learning Outcomes

This project demonstrates practical backend development concepts including:

- REST API Design
- Authentication & Authorization
- JWT Security
- Password Encryption
- MongoDB Data Modeling
- Banking System Logic
- Atomic Transactions
- Idempotency
- Email Integration
- Error Handling
- Backend Architecture



# 🤝 Contributing

Contributions, suggestions, and improvements are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request



# 👨‍💻 Author

**Kirti Vivek Sheth**

- GitHub: https://github.com/kirti24-s
- LinkedIn: https://www.linkedin.com/in/kirti24-s



# ⭐ Support

If you found this project helpful, consider giving it a **⭐ Star** on GitHub.

It helps support the project and motivates future improvements.


## 💙 Built with Node.js, Express.js, MongoDB & JavaScript
