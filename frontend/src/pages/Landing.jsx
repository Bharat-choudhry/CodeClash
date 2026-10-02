import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-white font-sans relative flex flex-col overflow-x-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

      {/* NAVBAR */}
      <nav className="w-full flex justify-between items-center px-8 py-6 relative z-20 border-b border-white/5">
        <div className="text-xl font-extrabold tracking-tighter flex items-center gap-2 cursor-pointer">
          <span className="text-[#facc15]">⚔️</span>
          <span className="text-white">CodeClash</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium">
          <button 
            onClick={() => navigate("/login")} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => navigate("/register")} 
            className="bg-white text-black px-5 py-2 rounded hover:bg-gray-200 transition-colors font-semibold"
          >
            Register
          </button>
        </div>
      </nav>

      {/* MAIN HERO CONTENT */}
      <main className="flex-1 w-full flex flex-col items-center justify-center px-6 relative z-20 text-center mt-16 pb-20">
        
        {/* Top Badge */}
        <div className="flex items-center gap-3 text-xs font-mono tracking-[0.2em] text-gray-400 uppercase mb-8">
          <span className="w-2 h-2 rounded-full bg-[#facc15] shadow-[0_0_8px_#facc15]"></span>
          Multiplayer Rooms <span className="text-gray-600">•</span> Live
        </div>

        {/* Tumhara Original Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
          <span className="text-white">The Ultimate Real-Time</span><br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] via-[#fb7185] to-[#a855f7]">
            DSA Battleground
          </span>
        </h1>

        {/* Tumhara Original Sub-headline (Multiplayer updated) */}
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl leading-relaxed">
          Stop coding alone. AI-generated LeetCode-style problems ke saath custom rooms banao aur apne doston ko battle ke liye challenge karo. <span className="text-white font-semibold">Kya tumhara logic sabse fast hai?</span>
        </p>

        {/* Tumhare specific Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate("/register")}
            className="bg-white text-black font-semibold px-8 py-3.5 rounded hover:bg-gray-200 transition-colors"
          >
            Get Started
          </button>
          <button 
            onClick={() => navigate("/dashboard")}
            className="border border-gray-700 text-white font-semibold px-8 py-3.5 rounded hover:bg-white/5 transition-colors"
          >
            Join Battle
          </button>
        </div>
      </main>
    </div>
  );
}