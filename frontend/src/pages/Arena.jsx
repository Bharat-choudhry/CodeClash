
import React from 'react';
import Editor from '@monaco-editor/react';

export default function Arena() {
  return (
    <div className="flex flex-col h-screen w-full bg-arena-dark text-white overflow-hidden">
      
      {/* TOP NAVBAR: Battle Arena Header */}
      <div className="h-16 border-b border-arena-surface bg-arena-dark flex items-center justify-between px-6 shadow-md z-10 shrink-0">
        <h1 className="text-2xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-player1 to-player2">
          ⚔️ Battle Arena
        </h1>
        <div className="flex items-center gap-4">
           <span className="text-sm font-mono bg-arena-surface border border-player1/30 px-3 py-1 rounded text-player1">Player 1 (You)</span>
           <span className="font-bold text-gray-500 italic">VS</span>
           <span className="text-sm font-mono bg-arena-surface border border-player2/30 px-3 py-1 rounded text-player2">Opponent</span>
        </div>
      </div>

      {/* SPLIT SCREEN CONTAINER */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* left panel-problem statement */} 
        <div className="w-1/2 p-8 border-r border-arena-surface overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold font-sans">1. Two Sum</h1>
            <span className="text-player1 border border-player1 px-3 py-1 rounded-full text-sm font-mono">
              Easy
            </span>
          </div>
          <p className="text-gray-300 font-sans leading-relaxed mb-6">
            Given an array of integers <code className="bg-arena-surface px-1.5 py-0.5 rounded font-mono text-sm">nums</code> and an integer <code className="bg-arena-surface px-1.5 py-0.5 rounded font-mono text-sm">target</code>, return indices of the two numbers such that they add up to target.
          </p>

          <div className="bg-arena-surface p-4 rounded-lg border border-gray-700">
            <p className="font-mono text-sm text-gray-300">
              <span className="text-player2">Input:</span> nums = [2,7,11,15], target = 9 <br/>
              <span className="text-player1">Output:</span> [0,1]
            </p>
          </div>
        </div>

        {/* right panel-editor */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
          <div className="h-12 border-b border-arena-surface flex items-center justify-between px-4 bg-arena-dark shrink-0">
            <span className="font-mono text-sm text-gray-400">main.cpp</span>
            <span className="font-mono text-sm text-player1 font-bold">20:00</span>
          </div>

          <div className="flex-grow">
            <Editor
              height="100%"
              defaultLanguage='cpp'
              theme="vs-dark"
              defaultValue={'#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Ready for Battle!" << endl;\n    return 0;\n}'}
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
    </div>
  );
}