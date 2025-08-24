const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    telegramId: { type: String, index: true, unique: true },
    username: String,
    firstName: String,
    lastName: String,
    photoUrl: String,

    email: String,
    walletAddress: String,

    balance: { type: Number, default: 0 },
    adsWatched: { type: Number, default: 0 },
    referrals: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
