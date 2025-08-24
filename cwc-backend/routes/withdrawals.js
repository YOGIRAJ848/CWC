const express = require("express");
const { z } = require("zod");
const User = require("../models/User");
const Withdrawal = require("../models/Withdrawal");
const router = express.Router();

/**
 * POST /api/withdrawals
 * Body: { telegramId, amount, address }
 */
router.post("/", async (req, res) => {
  const Body = z.object({
    telegramId: z.string(),
    amount: z.number().positive(),
    address: z.string().min(3)
  });

  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.message });

  const user = await User.findOne({ telegramId: parsed.data.telegramId });
  if (!user) return res.status(404).json({ ok: false, error: "User not found" });

  if (user.balance < parsed.data.amount) {
    return res.status(400).json({ ok: false, error: "Insufficient balance" });
  }

  // Deduct balance and create withdrawal
  user.balance = +(user.balance - parsed.data.amount).toFixed(4);
  await user.save();

  const w = await Withdrawal.create({
    user: user._id,
    amount: parsed.data.amount,
    address: parsed.data.address
  });

  res.json({ ok: true, withdrawal: w });
});

/**
 * (Optional) GET /api/withdrawals/admin
 * List all withdrawals (add auth later)
 */
router.get("/admin", async (_req, res) => {
  const list = await Withdrawal.find().populate("user", "telegramId username");
  res.json({ ok: true, withdrawals: list });
});

module.exports = router;
