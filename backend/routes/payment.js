const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  handleWebhook,
} = require("../controllers/paymentController");

// route to create stripe checkout session
router.post("/create-checkout-session", createCheckoutSession);

// route to handle stripe webhook after payment success
router.post("/webhook", handleWebhook);

module.exports = router;