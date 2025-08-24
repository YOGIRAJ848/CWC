import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

// Handle /start
bot.start((ctx) => {
  ctx.reply("🚀 Welcome to CWC WebApp! Click below to open:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open App",
            web_app: { url: "https://cwc-git-main-paradox-s-projects-703097cc.vercel.app" },
          },
        ],
      ],
    },
  });
});

export default async function handler(req, res) {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Bot error" });
  }
}
