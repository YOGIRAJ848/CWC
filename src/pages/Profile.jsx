import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";

export default function Profile() {
  const { user, setUser, referrals } = useApp();
  const [name, setName] = useState(user.name);
  const [wallet, setWallet] = useState(user.wallet || "");

  const save = (e) => {
    e.preventDefault();
    setUser({ ...user, name, wallet });
    alert("Profile saved.");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-blue-600 text-white grid place-items-center text-xl">🧑‍🚀</div>
        <div>
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="text-sm text-gray-500">Referrals: {referrals}</div>
        </div>
      </div>

      <form onSubmit={save} className="rounded-xl bg-white p-4 shadow space-y-3">
        <label className="block">
          <span className="text-sm text-gray-600">User name </span>
          <input value={name} onChange={(e) => setName(e.target.value)}
                 className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600">CWC Wallet Adress</span>
          <input value={wallet} onChange={(e) => setWallet(e.target.value)}
                 className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="0x..." />
        </label>
        <button className="w-full rounded-lg bg-blue-600 py-2 text-white">Submit</button>
      </form>

      <div className="rounded-xl bg-white p-4 shadow">
        <div className="text-sm text-gray-600 mb-1">Your Referral Link (mock)</div>
        <code className="block rounded-lg bg-gray-100 p-2 break-all">https://t.me/YourBot?start=12345</code>
      </div>
    </div>
  );
}
