const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");
const { sendEmailWithPDF } = require("../utils/sendEmail");

// creates stripe checkout session and saves user to db
const createCheckoutSession = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // save or update user in mongodb
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, role });
    } else {
      user.name = name;
      user.role = role;
    }
    await user.save();

    // create stripe checkout session with ₹50 price
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "PDF Access",
              description: `PDF for ${role}`,
            },
            // amount in paise — 39 rupees = 3900 paise
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ],
      // redirect urls after payment
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      // store user info in metadata for webhook use
      metadata: { email, role, name },
    });

    // save stripe session id to user record
    user.stripeSessionId = session.id;
    await user.save();

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

// handles stripe webhook after successful payment
const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    // verify webhook signature to confirm it's from stripe
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).json({ error: "Webhook verification failed" });
  }

  // only handle successful payment events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { email, role, name } = session.metadata;

    try {
      // mark user as paid in db
      await User.findOneAndUpdate({ email }, { isPaid: true });

      // send pdf email to user based on their role
      await sendEmailWithPDF({ name, email, role });

      console.log(`✅ Payment success — PDF sent to ${email}`);
    } catch (err) {
      console.error("Post-payment error:", err.message);
    }
  }

  res.json({ received: true });
};

module.exports = { createCheckoutSession, handleWebhook };