import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState({ name: "PARADOX", wallet: "" });
  const [balance, setBalance] = useState(0.02); // SUI
  const [adsWatched, setAdsWatched] = useState(2);
  const [referrals, setReferrals] = useState(0);

  const addEarning = (amt) => setBalance((b) => +(b + amt).toFixed(4));
  const watchAd = (reward = 0.01) => {
    setAdsWatched((n) => n + 1);
    addEarning(reward);
  };
  const addReferral = () => {
    setReferrals((n) => n + 1);
    addEarning(0.01);
  };
  const withdraw = (amt) => {
    if (amt <= 0 || amt > balance) return false;
    setBalance((b) => +(b - amt).toFixed(4));
    return true;
  };

  const value = {
    user, setUser,
    balance, adsWatched, referrals,
    addEarning, watchAd, addReferral, withdraw,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export const useApp = () => useContext(AppContext);
