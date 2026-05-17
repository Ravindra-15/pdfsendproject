const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  handleWebhook,
  handlePaymentSuccess,
} = require("../controllers/paymentController");

// route to create stripe checkout session
router.post("/create-checkout-session", createCheckoutSession);

// route to handle stripe webhook
router.post("/webhook", handleWebhook);

// route called from frontend success page to send email
router.get("/payment-success", handlePaymentSuccess);

module.exports = router;