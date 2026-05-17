const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// ✅ CORS — allows both local and Vercel frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);

// ✅ Webhook route MUST come before express.json()
// Stripe needs raw body for webhook verification
app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" })
);

// ✅ Regular JSON parser for all other routes
app.use(express.json());

// ✅ Routes
const paymentRoutes = require("./routes/payment");
app.use("/api/payment", paymentRoutes);

// ✅ Health check route — useful for Vercel
app.get("/", (req, res) => {
  res.json({ message: "Vikas Backend is running ✅" });
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 8080, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 8080}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

module.exports = app;