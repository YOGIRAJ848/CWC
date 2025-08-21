import { useApp } from "../context/AppContext.jsx";

export default function Earn() {
  const { watchAd, addEarning } = useApp();

  const tasks = [
    { id: "ad", title: "Watch a 30s Ad", reward: 0.01, action: () => watchAd(0.01) },
    { id: "join", title: "Join Telegram Channel", reward: 0.02, action: () => addEarning(0.02) },
    { id: "checkin", title: "Daily Check‑in", reward: 0.005, action: () => addEarning(0.005) },
  ];

  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <div key={t.id} className="rounded-xl bg-white p-4 shadow flex items-center justify-between">
          <div>
            <div className="font-semibold">{t.title}</div>
            <div className="text-sm text-gray-500">Reward: CWC {t.reward}</div>
          </div>
          <button onClick={t.action} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Earn</button>
        </div>
      ))}
      <p className="text-xs text-gray-500">*Make shure all task should completed</p>
    </div>
  );
}
