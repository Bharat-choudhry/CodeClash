import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const NAV = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
  { to: '/profile', icon: '👤', label: 'Profile' },
];

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-lc-bg text-lc-text overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-lc-border bg-lc-sidebar">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-5 cursor-pointer border-b border-lc-border"
        >
          <span className="text-lc-accent text-xl">⚔</span>
          <span className="font-display font-bold text-white text-lg tracking-tight">CodeClash</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-lc-accent/10 text-lc-accent'
                    : 'text-lc-muted hover:text-lc-text hover:bg-white/5'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-lc-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-lc-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}