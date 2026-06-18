require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
  tls: {
    rejectUnauthorized: false, // 🔥 FIX FOR SELF-SIGNED CERT ERROR
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendingRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend Ledger!";
  const text = `Hello ${name},\n\nThank you for registering at Backend Ledger.We're excited to have you on board!\n\nBest  regards, \nThe Backend Ledger Team`;
  const html = `<p>Hello ${name},</p><p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionSuccessEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Successful!";

  const text = `Hello ${name},\n\nYour transaction of ${amount} to account  ${toAccount} was successful.\n\n Best regards,\nThe Backend Ledger Team`;

  const html = `<p>Hello ${name},</p><p>Your transaction of ${amount} to account ${toAccount} was successful.\n\n </p> <p>Nest regards,\nThe Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Failed";

  const text = `Hello ${name},

We regret to inform you that your transaction of ₹${amount} to account ${toAccount} could not be completed.

Please verify the account details and try again. If the issue persists, contact our support team.

Best regards,
The Backend Ledger Team`;

  const html = `
    <p>Hello ${name},</p>

    <p>
      We regret to inform you that your transaction of
      <strong>₹${amount}</strong> to account
      <strong>${toAccount}</strong> could not be completed.
    </p>

    <p>
      Please verify the account details and try again.
      If the issue persists, contact our support team.
    </p>

    <p>Best regards,<br>The Backend Ledger Team</p>
  `;
  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendingRegistrationEmail,
  sendTransactionSuccessEmail,
  sendTransactionFailureEmail,
};
