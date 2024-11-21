// server.js
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")("YOUR_STRIPE_SECRET_KEY"); // Stripe API key

const app = express();
app.use(bodyParser.json());

// Subscription plans
const plans = {
  free: { limit: 5, cost: 0 },
  bronze: { limit: 7, cost: 10 },
  silver: { limit: 10, cost: 50 },
  gold: { limit: Infinity, cost: 100 },
};

// Mock database of users
let users = {}; // Format: { userId: { email, plan, watchTime } }

// Create an invoice email template
const generateInvoiceEmail = (plan) => `
  <h1>Subscription Successful: ${plan} Plan</h1>
  <p>Thank you for subscribing! Your ${plan} plan has been activated.</p>
  <p>Here are the details:</p>
  <ul>
    <li>Plan: ${plan}</li>
    <li>Price: ₹${plans[plan].cost}</li>
    <li>Video Watch Limit: ${plans[plan].limit} minutes</li>
  </ul>
`;

// Route: Create User
app.post("/api/create-user", (req, res) => {
  const { email, plan = "free" } = req.body;
  const userId = uuidv4();
  users[userId] = { email, plan, watchTime: 0 };
  res.json({ userId, plan });
});

// Route: Purchase Subscription
app.post("/api/subscribe", async (req, res) => {
  const { userId, plan } = req.body;
  if (!plans[plan]) return res.status(400).json({ error: "Invalid plan" });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: plans[plan].cost * 100, // Stripe requires smallest currency unit
    currency: "inr",
    payment_method_types: ["card"],
  });

  res.send({ clientSecret: paymentIntent.client_secret });
});

// Route: Confirm Subscription Payment
app.post("/api/confirm-subscription", async (req, res) => {
  const { userId, plan } = req.body;
  const user = users[userId];
  if (!user) return res.status(404).json({ error: "User not found" });

  // Update the user's subscription
  user.plan = plan;
  user.watchTime = 0; // Reset watch time

  // Send email using Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com",
      pass: "your-email-password",
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: user.email,
    subject: `Subscription Successful: ${plan} Plan`,
    html: generateInvoiceEmail(plan),
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) return res.status(500).send(error.toString());
    res.json({ success: "Subscription updated and email sent.", plan });
  });
});

// Route: Watch Video
app.get("/api/watch/:userId", (req, res) => {
  const { userId } = req.params;
  const user = users[userId];
  if (!user) return res.status(404).json({ error: "User not found" });

  const userPlan = plans[user.plan];
  if (user.watchTime >= userPlan.limit) {
    return res.status(403).json({ error: "Watch time limit reached. Upgrade your plan!" });
  }

  user.watchTime += 1;
  res.json({ success: "You are watching the video", remainingTime: userPlan.limit - user.watchTime });
});

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
