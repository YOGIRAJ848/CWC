const { Schema, model, Types } = require("mongoose");

const WithdrawalSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
  },
  { timestamps: true }
);

module.exports = model("Withdrawal", WithdrawalSchema);
