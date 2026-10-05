
import React from 'react';

import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#09090b] text-white relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

      
      <div className="z-10 w-64 border-r border-white/10 bg-[#09090b]">
        {/* SIDEBAR */}
      <div className="w-64 border-r border-white/10 bg-[#09090b]/80 backdrop-blur-md p-6 flex flex-col shrink-0 relative z-10">
        <div onClick={() => navigate('/')} className="text-xl font-extrabold tracking-tighter flex items-center gap-2 mb-10 cursor-pointer">
          <span className="text-[#facc15]">⚔️</span>
          <span className="text-white">CodeClash</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <a href="/dashboard" className="block px-4 py-3 rounded bg-white/10 text-white font-semibold transition-colors border-l-2 border-[#facc15]">📊 Dashboard</a>
          <a href="/leaderboard" className="block px-4 py-3 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors">🏆 Leaderboard</a>
          <a href="/profile" className="block px-4 py-3 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors">👤 Profile</a>
        </nav>
        
        <button onClick={() => navigate('/login')} className="text-left px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded transition-colors mt-auto font-mono text-sm">
          🚪 Logout
        </button>
      </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 relative z-10">
        <Outlet />
      </div>
      
    </div>
  );
}