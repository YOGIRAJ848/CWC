import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";

export default function Withdraw() {
  const { balance, withdraw, user } = useApp();
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState(user.wallet || "");

  const onSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!address) return alert("Enter your SUI wallet address.");
    if (Number.isNaN(amt)) return alert("Enter a valid amount.");
    if (!withdraw(amt)) return alert("Amount must be > 0 and ≤ balance.");
    alert(`Withdrawal request submitted: SUI ${amt} to ${address} (mock).`);
    setAmount("");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow">
        <div className="text-gray-500">Available Balance</div>
        <div className="text-2xl font-bold text-blue-600">CWC {balance.toFixed(4)}</div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow space-y-3">
        <label className="block">
          <span className="text-sm text-gray-600">CWC Address</span>
          <input value={address} onChange={(e) => setAddress(e.target.value)}
                 className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="0x..." />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600">Amount</span>
          <input value={amount} onChange={(e) => setAmount(e.target.value)}
                 className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Minimum limits 100" />
        </label>
        <button className="w-full rounded-lg bg-blue-600 py-2 text-white">Request Withdraw</button>
      </div>
    </form>
  );
}
