import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  // Dummy user data (Baad mein backend se aayega)
  const user = {
    name: "Bharat",
    elo: 1250,
    winRate: "65%"
  };

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-white font-sans overflow-hidden relative">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>

      {/* SIDEBAR */}
      <div className="w-64 border-r border-white/10 bg-[#09090b]/80 backdrop-blur-md p-6 flex flex-col shrink-0 relative z-10">
        <div onClick={() => navigate('/')} className="text-xl font-extrabold tracking-tighter flex items-center gap-2 mb-10 cursor-pointer">
          <span className="text-[#facc15]">⚔️</span>
          <span className="text-white">CodeClash</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <a href="/dashboard" className="block px-4 py-3 rounded bg-white/10 text-white font-semibold transition-colors border-l-2 border-[#facc15]">📊 Dashboard</a>
          <a href="/leaderboard" className="block px-4 py-3 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors">🏆 Leaderboard</a>
          <a href="#" className="block px-4 py-3 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors">👤 Profile</a>
        </nav>
        
        <button onClick={() => navigate('/login')} className="text-left px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded transition-colors mt-auto font-mono text-sm">
          🚪 Logout
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-10 relative z-10 overflow-y-auto">
        
        {/* Header Stats */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <div className="text-gray-400 font-mono text-sm flex gap-4">
            <span>Current Elo: <span className="text-[#facc15] font-bold text-lg">{user.elo}</span></span>
            <span>|</span>
            <span>Win Rate: <span className="text-white font-bold text-lg">{user.winRate}</span></span>
          </div>
        </div>
           
        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl">
          <button className="bg-white text-black py-6 px-4 rounded-xl hover:bg-gray-200 transition-all flex flex-col items-center justify-center gap-1 hover:scale-105">
            <span className="text-3xl mb-1">⚡</span>
            <span className="font-bold text-lg tracking-wide">QUICK MATCH</span>
            <span className="text-xs text-gray-600 font-medium text-center mt-1">
              Find a random opponent instantly
            </span>
          </button>
          
          {/* Create Room Button */}
          <button className="bg-[#121214] border-2 border-[#facc15]/50 text-[#facc15] py-6 px-4 rounded-xl hover:bg-[#facc15]/10 transition-all flex flex-col items-center justify-center gap-1 hover:scale-105 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
            <span className="text-3xl mb-1">👑</span>
            <span className="font-bold text-lg tracking-wide">CREATE ROOM</span>
            <span className="text-xs text-gray-400 font-medium text-center mt-1">
              Invite friends for a custom battle
            </span>
          </button>
          
          {/* Join Room Button */}
          <button className="bg-[#121214] border border-white/20 text-white py-6 px-4 rounded-xl hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-1 hover:scale-105">
            <span className="text-3xl mb-1">🔗</span>
            <span className="font-bold text-lg tracking-wide">JOIN ROOM</span>
            <span className="text-xs text-gray-400 font-medium text-center mt-1">
              Enter room code to join a lobby
            </span>
          </button>
        </div>

        {/* Recent Battles Section */}
        <div className="max-w-4xl">
          <h2 className="text-xl font-bold mb-5 border-b border-white/10 pb-3 text-gray-200">Recent Battles</h2>
          
          <div className="space-y-3">
            {/* Match 1 - Win */}
            <div className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
                <div>
                  <p className="font-bold text-white text-lg">Won vs @ByteKing</p>
                  <p className="text-sm text-gray-400 font-mono mt-1">Two Sum</p>
                </div>
              </div>
              <span className="text-green-400 font-mono font-bold text-lg">+15 Elo</span>
            </div>

            {/* Match 2 - Loss */}
            <div className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"></span>
                <div>
                  <p className="font-bold text-white text-lg">Lost vs @CodePro</p>
                  <p className="text-sm text-gray-400 font-mono mt-1">Valid Anagram</p>
                </div>
              </div>
              <span className="text-red-400 font-mono font-bold text-lg">-10 Elo</span>
            </div>
            
            {/* Match 3 - Win */}
            <div className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
                <div>
                  <p className="font-bold text-white text-lg">Won vs @Alex</p>
                  <p className="text-sm text-gray-400 font-mono mt-1">Merge Intervals</p>
                </div>
              </div>
              <span className="text-green-400 font-mono font-bold text-lg">+12 Elo</span>
            </div>
          </div>
        </div>
         <div>
          <link to={'/profile/${user.username}'}>{user.username}</link>
         </div>
      </div>
    </div>
  );
}