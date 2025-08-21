import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function Home() {
  const nav = useNavigate();
  const { user, balance, adsWatched, referrals, addReferral } = useApp();

  return (
    <div className="space-y-4">
      {/* Profile banner */}
      <div className="rounded-xl bg-blue-600 text-white p-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-white/20 grid place-items-center text-xl">🧑‍🚀</div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-white/80 text-sm">CWC {balance.toFixed(4)}</p>
          </div>
        </div>
      </div>

      {/* Welcome card */}
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="text-lg font-semibold">Welcome To {user.name}</h3>
        <p className="text-gray-500 mb-3">Start Earning</p>
        <button onClick={() => nav("/earn")} className="rounded-lg bg-blue-600 px-4 py-2 text-white">
          Earn Now
        </button>
      </div>

      {/* Total earnings */}
      <div className="rounded-xl bg-blue-500 text-white p-4">
        <p className="text-3xl font-bold">CWC {balance.toFixed(2)}</p>
        <p className="text-white/80">Total Earnings</p>
      </div>

      {/* Ads watched + referral */}
      <div className="rounded-xl bg-gray-900 text-white p-4 flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold">{adsWatched}</div>
          <div className="text-white/70 text-sm">Total Ads Watched</div>
        </div>
        <button onClick={addReferral} className="rounded-lg bg-blue-600 px-4 py-2">
          👥 Refer & Earn
        </button>
      </div>
    </div>
  );
}
