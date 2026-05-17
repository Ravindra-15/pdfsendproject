const mongoose = require("mongoose");

// User schema — stores form data and payment status
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // role determines which PDF gets sent
    role: {
      type: String,
      enum: ["student", "working_professional", "teacher"],
      required: true,
    },
    // tracks if stripe payment was successful
    isPaid: {
      type: Boolean,
      default: false,
    },
    // stripe session id for webhook matching
    stripeSessionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);