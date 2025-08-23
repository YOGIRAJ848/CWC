import { Telegraf } from "telegraf";
const bot = new Telegraf(process.env.8183297173:AAEpwXgMaUWr_TY9FkQzJwd56fsVed8EYdU);

// Handle /start
bot.start((ctx) => {
ctx.reply("🚀 Welcome to CWC WebApp! Click below to open:", {
reply_markup: {
inline_keyboard: [
[
{
text: "Open App",
web_app: { url: "https://cwc-git-main-paradox-s-projects-703097cc.vercel.app?_vercel_share=0JMqBOjFmCNTlSB3Rbzx1EXNU639HW7o" }
}
]
]
} 
});
});

export default async function handler(req, res) {
try {
await bot.handleUpdate(req.body);
res.status(200).json({ ok: true });
} catch (err) {
console.error(err);
res.status(500).send("Bot error");
}
}