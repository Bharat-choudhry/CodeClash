import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [socket, setSocket] = useState(null);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  
  const [lobbyData, setLobbyData] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem('user')) || {
    username: "Bharat",
    elo: 1250,
    winRate: "65%"
  };

  useEffect(() => {
    const newSocket = io('http://localhost:5005'); 
    setSocket(newSocket);

    newSocket.on('roomCreated', (data) => {
      setLobbyData({ roomId: data.roomId, isHost: true, players: data.players });
    });

    newSocket.on('roomJoined', (data) => {
      setLobbyData({ roomId: data.roomId, isHost: false, players: data.players });
      setShowJoinPopup(false); 
    });

    newSocket.on('playerJoined', (data) => {
      setLobbyData(prev => {
        if (!prev) return null;
        return { ...prev, players: data.players };
      });
    });

    newSocket.on('battleTimerStarted', (data) => {
      setCountdown(data.duration); 
    });

    newSocket.on('roomError', (msg) => {
      alert(msg);
    });

    return () => newSocket.disconnect();
  }, [navigate]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      if (lobbyData) {
       
        navigate(`/arena/${lobbyData.roomId}`, { 
          state: { 
            isHost: lobbyData.isHost, 
            players: lobbyData.players,
            question: lobbyData.question 
          } 
        });
      }
    }
  }, [countdown, lobbyData, navigate]);

  const handleCreateRoom = () => {
    if (socket) socket.emit('createRoom', { username: storedUser.username });
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (socket && joinCode.trim()) {
      socket.emit('joinRoom', { roomId: joinCode.toUpperCase(), userData: { username: storedUser.username } });
    }
  };

  const handleStartBattle = () => {
    if (socket && lobbyData?.roomId) {
      socket.emit('startBattle', { 
        roomId: lobbyData.roomId, 
        username: storedUser.username 
      });
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-white font-sans overflow-hidden relative">
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>

      <div className="flex-1 p-10 relative z-10 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {storedUser.username}!</h1>
          <div className="text-gray-400 font-mono text-sm flex gap-4">
            <span>Current Elo: <span className="text-[#facc15] font-bold text-lg">{storedUser.elo}</span></span>
            <span>|</span>
            <span>Win Rate: <span className="text-white font-bold text-lg">{storedUser.winRate}</span></span>
          </div>
        </div>
           
        {/* Yahan grid-cols-2 kiya gaya hai taaki do buttons mast set ho jayein */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl">
          <button onClick={handleCreateRoom} className="bg-[#121214] border-2 border-[#facc15]/50 text-[#facc15] py-6 px-4 rounded-xl hover:bg-[#facc15]/10 transition-all flex flex-col items-center justify-center gap-1 hover:scale-105 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
            <span className="text-3xl mb-1">👑</span>
            <span className="font-bold text-lg tracking-wide">CREATE ROOM</span>
            <span className="text-xs text-gray-400 font-medium text-center mt-1">Custom battle lobby</span>
          </button>
          
          <button onClick={() => setShowJoinPopup(true)} className="bg-[#121214] border border-white/20 text-white py-6 px-4 rounded-xl hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-1 hover:scale-105">
            <span className="text-3xl mb-1">🔗</span>
            <span className="font-bold text-lg tracking-wide">JOIN ROOM</span>
            <span className="text-xs text-gray-400 font-medium text-center mt-1">Enter code to join</span>
          </button>
        </div>

        <div className="max-w-4xl">
          <h2 className="text-xl font-bold mb-5 border-b border-white/10 pb-3 text-gray-200">Recent Battles</h2>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/5">
               <div className="flex items-center gap-5">
                 <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
                 <div>
                   <p className="font-bold text-white text-lg">Won vs @ByteKing</p>
                   <p className="text-sm text-gray-400 font-mono mt-1">Two Sum</p>
                 </div>
               </div>
               <span className="text-green-400 font-mono font-bold text-lg">+15 Elo</span>
             </div>
          </div>
        </div>
      </div>

      {showJoinPopup && !lobbyData && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#121214] p-8 rounded-2xl border border-white/10 w-96 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">Join Arena</h3>
            <p className="text-gray-400 text-sm mb-6">Enter the 6-character room code.</p>
            <form onSubmit={handleJoinSubmit} className="flex flex-col gap-4">
              <input type="text" placeholder="e.g. AB79X2" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength={6} className="bg-[#09090b] border border-white/20 rounded-lg p-3 text-white text-center text-xl font-mono focus:outline-none focus:border-[#facc15]" autoFocus />
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowJoinPopup(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white font-semibold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#facc15] hover:bg-yellow-500 rounded-lg text-black font-bold">Join</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {lobbyData && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 backdrop-blur-md">
          <div className="bg-[#121214] border border-[#facc15]/30 p-10 rounded-2xl max-w-lg w-full text-center shadow-[0_0_40px_rgba(250,204,21,0.1)]">
            
            <h2 className="text-3xl font-bold text-white mb-2">Waiting Lobby</h2>
            <div className="bg-black/50 py-3 px-6 rounded-lg inline-block mb-8 border border-white/10">
              <span className="text-gray-400 text-sm mr-3">Room Code:</span>
              <span className="text-[#facc15] font-mono text-2xl font-bold tracking-widest">{lobbyData.roomId}</span>
            </div>

            <div className="text-left mb-8">
              <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Players Joined ({lobbyData.players?.length||1})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {(lobbyData.players || [storedUser.username]).map((player, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center text-black font-bold text-sm">
                      {player ? player.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span className="font-semibold text-lg">{player || 'Unknown Player'}</span>
                    {index === 0 && <span className="ml-auto text-xs bg-[#facc15]/20 text-[#facc15] px-2 py-1 rounded">HOST</span>}
                  </div>
                ))}  
              </div>
            </div>

            {countdown !== null ? (
              <div className="mt-6">
                <p className="text-gray-400 mb-2">Battle starting in</p>
                <div className="text-6xl font-black text-[#facc15] drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                  {countdown}
                </div>
              </div>
            ) : lobbyData.isHost ? (
              <button onClick={handleStartBattle} className="w-full bg-[#facc15] hover:bg-yellow-500 text-black font-bold text-xl py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:scale-105">
                START BATTLE ⚔️
              </button>
            ) : (
              <div className="py-4 text-gray-400 italic">
                Waiting for host to start the battle...
              </div>
            )}
            
          </div>
        </div>
      )}

    </div>
  );
}