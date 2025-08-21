import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Earn from "./pages/Earn.jsx";
import Withdraw from "./pages/Withdraw.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="bg-gray-400 shadow-sm">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center gap-3">
          <span className="text-xl font-semibold">CWC</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 mx-auto w-full max-w-md px-4 py-4 space-y-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {/* Bottom Nav */}
      <nav className="bg-gradient-to-r from-purple-500 to-blue-500 to-green-500">
        <div className="mx-auto max-w-md grid grid-cols-4 text-white">
          <Tab to="/" label="Home" icon="🏠" />
          <Tab to="/earn" label="Earn" icon="💰" />
          <Tab to="/withdraw" label="Withdraw" icon="📤" />
          <Tab to="/profile" label="Profile" icon="👤" />
        </div>
      </nav>
    </div>
  );
}

function Tab({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex flex-col items-center py-3 text-sm ${isActive ? "font-semibold opacity-100" : "opacity-80"}`
      }
    >
      <span aria-hidden className="text-lg">{icon}</span>
      {label}
    </NavLink>
  );
}
