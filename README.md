A **Bank Transaction Backend API** built using **Node.js and JavaScript** 💻 that simulates basic banking operations in a secure and structured way. It provides a complete **authentication system using JWT**, allowing users to register and login safely 🔐. Email notifications are sent to users on successful registration and after transactions 📩.

The API allows users to **create bank accounts, view all their accounts, and check the balance of each account** 💰. It also supports **secure money transfers between users**, along with a system account that is used to provide **initial funds automatically when a new user registers**.

For security and reliability, the project implements an **idempotency key mechanism** to prevent duplicate transactions if the same request is sent multiple times ⚙️. It also includes a **token blacklist system**, which ensures that once a user logs out, their JWT token becomes invalid and cannot be reused again 🚫.

Overall, this project demonstrates core backend concepts such as authentication, account management, secure transactions, and real-world banking system logic 🏦.
