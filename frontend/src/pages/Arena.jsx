import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';

export default function Arena() {
  const { roomId } = useParams();
  const location = useLocation();
  
  // FIX: Dashboard se bheja hua question yahan nikal liya
  const { isHost, players, question } = location.state || { players: [], question: null };
  const [showRankings, setShowRankings] = useState(false);

  const myName = players && players.length > 0 ? players[0] : "Player 1";
  const opponentName = players && players.length > 1 ? players[1] : "Waiting...";

  return (
    <div className="flex flex-col h-screen w-full bg-arena-dark text-white overflow-hidden relative">
      
      {/* TOP NAVBAR */}
      <div className="h-16 border-b border-arena-surface bg-arena-dark flex items-center justify-between px-6 shadow-md z-10 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-player1 to-player2">
            ⚔️ Battle Arena
          </h1>
          <span className="text-xs font-mono bg-black/50 text-gray-400 px-2 py-1 rounded border border-gray-700">
            Room: {roomId}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
           <span className="text-sm font-mono bg-arena-surface border border-player1/30 px-3 py-1 rounded text-player1">
             {myName} {isHost && '(Host)'}
           </span>
           <span className="font-bold text-gray-500 italic">VS</span>
           <span className="text-sm font-mono bg-arena-surface border border-player2/30 px-3 py-1 rounded text-player2">
             {opponentName}
           </span>
           
           <button 
             onClick={() => setShowRankings(true)}
             className="ml-4 flex items-center gap-2 text-sm font-bold bg-[#facc15]/10 border border-[#facc15]/30 px-4 py-2 rounded-lg text-[#facc15] hover:bg-[#facc15]/20 transition-colors shadow-[0_0_10px_rgba(250,204,21,0.1)]"
           >
             🏆 Rankings
           </button>
        </div>
      </div>

      {/* SPLIT SCREEN CONTAINER */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANEL - DYNAMIC PROBLEM STATEMENT */} 
        <div className="w-1/2 p-8 border-r border-arena-surface overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold font-sans">
              {/* Dynamic Title */}
              {question ? question.title : "Generating Protocol..."}
            </h1>
            <span className="text-player1 border border-player1 px-3 py-1 rounded-full text-sm font-mono">
              {/* Dynamic Difficulty */}
              {question ? question.difficulty : "Unknown"}
            </span>
          </div>
          
          <p className="text-gray-300 font-sans leading-relaxed mb-6 whitespace-pre-wrap">
             {/* Dynamic Description */}
            {question ? question.description : "Please wait while AI constructs the battlefield..."}
          </p>

          {/* Dynamic Test Cases loop */}
          {question?.testCases?.map((tc, index) => (
            <div key={index} className="bg-arena-surface p-4 rounded-lg border border-gray-700 mb-4">
              <p className="font-mono text-sm text-gray-300 mb-2">
                <span className="text-player2 font-bold">Test Case {index + 1}</span>
              </p>
              <p className="font-mono text-sm text-gray-300">
                <span className="text-player2">Input:</span> {tc.input} <br/>
                <span className="text-player1">Output:</span> {tc.output}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT PANEL - EDITOR */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
          <div className="h-12 border-b border-arena-surface flex items-center justify-between px-4 bg-arena-dark shrink-0">
            <span className="font-mono text-sm text-gray-400">main.cpp</span>
            <span className="font-mono text-sm text-player1 font-bold">Battle Time</span>
          </div>

          <div className="flex-grow">
            <Editor
              height="100%"
              defaultLanguage='cpp'
              theme="vs-dark"
              defaultValue={'#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your logic here based on the AI question\n    return 0;\n}'}
              options={{
                fontSize: 16,
                fontFamily: 'JetBrains Mono',
                minimap: { enabled: false },
                padding: { top: 20 }
              }}
            />
          </div>
        </div>
      </div>

      {/* RANKINGS POPUP MODAL */}
      {showRankings && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#121214] border border-[#facc15]/20 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">🏆 Live Leaderboard</h2>
              <button onClick={() => setShowRankings(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
              {(players && players.length > 0 ? players : ['Player 1']).map((player, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="font-black text-xl w-8 text-center text-[#facc15]">#{index + 1}</span>
                    <span className="font-semibold text-lg text-white">{player}</span>
                  </div>
                  <span className="text-sm font-mono text-gray-400 bg-black/30 px-2 py-1 rounded">Coding...</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}