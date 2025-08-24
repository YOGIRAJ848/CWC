const express = require("express");
const { z } = require("zod");
const User = require("../models/User");
const { verifyTelegramInitData } = require("../utils/verifyTelegramInitData");
const router = express.Router();

/**
 * POST /api/users/sync
 * Body: { initData: string }
 * Verifies Telegram WebApp initData and upserts the user.
 */
router.post("/sync", async (req, res) => {
  try {
    const initData = req.body.initData;
    const verified = verifyTelegramInitData(initData, process.env.TELEGRAM_BOT_TOKEN);
    if (!verified || !verified.user) {
      return res.status(401).json({ ok: false, error: "Invalid Telegram initData" });
    }

    const tgUser = verified.user;
    const update = {
      telegramId: String(tgUser.id),
      username: tgUser.username || "",
      firstName: tgUser.first_name || "",
      lastName: tgUser.last_name || "",
      photoUrl: tgUser.photo_url || ""
    };

    const user = await User.findOneAndUpdate(
      { telegramId: String(tgUser.id) },
      { $setOnInsert: { balance: 0, adsWatched: 0, referrals: 0 }, $set: update },
      { upsert: true, new: true }
    );

    res.json({ ok: true, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

/**
 * GET /api/users/:telegramId
 */
router.get("/:telegramId", async (req, res) => {
  const u = await User.findOne({ telegramId: String(req.params.telegramId) });
  if (!u) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true, user: u });
});

/**
 * PATCH /api/users/:telegramId
 * Body: { email?, walletAddress? }
 */
router.patch("/:telegramId", async (req, res) => {
  const Body = z.object({
    email: z.string().email().optional(),
    walletAddress: z.string().min(3).optional()
  });
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.message });

  const u = await User.findOneAndUpdate(
    { telegramId: String(req.params.telegramId) },
    { $set: parsed.data },
    { new: true }
  );
  if (!u) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true, user: u });
});

/**
 * POST /api/users/:telegramId/earn
 * Body: { type: "ad" | "join" | "checkin", amount?: number }
 */
router.post("/:telegramId/earn", async (req, res) => {
  const Body = z.object({
    type: z.enum(["ad", "join", "checkin"]),
    amount: z.number().optional()
  });
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.message });

  const tgId = String(req.params.telegramId);
  const user = await User.findOne({ telegramId: tgId });
  if (!user) return res.status(404).json({ ok: false, error: "Not found" });

  let reward = 0;
  if (parsed.data.amount) reward = parsed.data.amount;
  else {
    if (parsed.data.type === "ad") reward = 0.01;
    if (parsed.data.type === "join") reward = 0.02;
    if (parsed.data.type === "checkin") reward = 0.005;
  }

  const inc = { balance: reward };
  if (parsed.data.type === "ad") inc.adsWatched = 1;

  await User.updateOne(
    { telegramId: tgId },
    {
      $inc: inc
    }
  );

  const updated = await User.findOne({ telegramId: tgId });
  res.json({ ok: true, user: updated, reward });
});

/**
 * POST /api/users/:telegramId/referral
 * increments referrals and balance
 */
router.post("/:telegramId/referral", async (req, res) => {
  const tgId = String(req.params.telegramId);
  const user = await User.findOneAndUpdate(
    { telegramId: tgId },
    { $inc: { referrals: 1, balance: 0.01 } },
    { new: true }
  );
  if (!user) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true, user });
});

module.exports = router;
