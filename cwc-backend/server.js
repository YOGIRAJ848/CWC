require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { Telegraf } = require("telegraf");

const { connectDB } = require("./db");
const usersRouter = require("./routes/users");
const withdrawalsRouter = require("./routes/withdrawals");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(",") || "*"
  })
);

// Health
app.get("/", (_req, res) => res.send("CWC Backend Running 🚀"));

// APIs
app.use("/api/users", usersRouter);
app.use("/api/withdrawals", withdrawalsRouter);

// Telegram bot
const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  console.error("❌ TELEGRAM_BOT_TOKEN missing");
  process.exit(1);
}
const bot = new Telegraf(botToken);

// /start shows WebApp button
bot.start(async (ctx) => {
  try {
    await ctx.reply("🚀 Welcome to CWC WebApp! Tap to open:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Open CWC App 🌐",
              web_app: { url: process.env.FRONTEND_URL }
            }
          ]
        ]
      }
    });
  } catch (e) {
    console.error("start error:", e);
  }
});

const USE_POLLING = String(process.env.USE_POLLING || "").toLowerCase() === "true";
const PORT = process.env.PORT || 10000;
const WEBHOOK_PATH = "/telegram/webhook";

async function bootstrap() {
  await connectDB(process.env.MONGODB_URI);

  if (USE_POLLING) {
    // Local dev convenience
    await bot.launch();
    console.log("🤖 Bot launched with LONG POLLING");
    app.listen(PORT, () => console.log(`HTTP on :${PORT}`));
  } else {
    // Webhook mode (Render)
    app.use(WEBHOOK_PATH, (req, res, next) => {
      // Telegraf needs raw body for secret check in some cases; for now json is fine.
      next();
    });

    app.post(WEBHOOK_PATH, async (req, res) => {
      try {
        await bot.handleUpdate(req.body);
        res.sendStatus(200);
      } catch (e) {
        console.error("Webhook handle error:", e);
        res.sendStatus(500);
      }
    });

    app.listen(PORT, async () => {
      const target = `${process.env.BACKEND_URL}${WEBHOOK_PATH}`;
      try {
        await bot.telegram.setWebhook(target);
        console.log(`✅ Webhook set to ${target}`);
      } catch (e) {
        console.error("setWebhook error:", e);
      }
      console.log(`HTTP on :${PORT}`);
    });
  }

  // Graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

bootstrap().catch((e) => {
  console.error("Bootstrap error:", e);
  process.exit(1);
});
