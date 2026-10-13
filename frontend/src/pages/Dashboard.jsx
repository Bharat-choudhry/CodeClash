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
  const [isGenerating, setIsGenerating] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem('user')) || { username: 'Coder', elo: 1200 };

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
      setLobbyData(prev => prev ? { ...prev, players: data.players } : null);
    });
    newSocket.on('generatingQuestion', () => setIsGenerating(true));
    newSocket.on('battleTimerStarted', (data) => {
      setIsGenerating(false);
      setLobbyData(prev => prev ? { ...prev, question: data.question, battleDuration: data.battleDuration } : null);
      setCountdown(data.lobbyCountdown); // 60 sec lobby prep
    });
    newSocket.on('roomError', (msg) => alert(msg));

    return () => newSocket.disconnect();
  }, []);

  // Countdown ticker
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const id = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(id);
    } else if (lobbyData) {
      navigate(`/arena/${lobbyData.roomId}`, {
        state: { isHost: lobbyData.isHost, players: lobbyData.players, question: lobbyData.question, battleDuration: lobbyData.battleDuration || 1200 }
      });
    }
  }, [countdown, lobbyData, navigate]);

  const handleCreateRoom = () => { if (socket) socket.emit('createRoom', { username: storedUser.username }); };
  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (socket && joinCode.trim())
      socket.emit('joinRoom', { roomId: joinCode.toUpperCase(), userData: { username: storedUser.username } });
  };
  const handleStartBattle = () => {
    if (socket && lobbyData?.roomId)
      socket.emit('startBattle', { roomId: lobbyData.roomId, username: storedUser.username });
  };

  const eloColor = storedUser.elo >= 1500 ? 'text-yellow-400' : storedUser.elo >= 1300 ? 'text-lc-accent' : 'text-lc-green';

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <p className="text-lc-muted text-sm font-mono mb-1">Welcome back,</p>
        <h1 className="text-3xl font-display font-bold text-white">{storedUser.username}</h1>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2 bg-lc-card border border-lc-border rounded-lg px-4 py-2">
            <span className="text-lc-muted text-xs font-mono">ELO</span>
            <span className={`font-mono font-bold text-lg ${eloColor}`}>{storedUser.elo}</span>
          </div>
          <Link to="/leaderboard" className="text-xs text-lc-muted hover:text-lc-accent font-mono transition-colors">
            View Leaderboard →
          </Link>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <button
          onClick={handleCreateRoom}
          className="group bg-lc-card border border-lc-border hover:border-lc-accent/50 rounded-xl p-6 text-left transition-all hover:bg-lc-accent/5"
        >
          <div className="text-2xl mb-3">👑</div>
          <p className="font-display font-bold text-white text-base">Create Room</p>
          <p className="text-lc-muted text-sm mt-1">Start a custom battle lobby</p>
        </button>

        <button
          onClick={() => setShowJoinPopup(true)}
          className="group bg-lc-card border border-lc-border hover:border-lc-blue/50 rounded-xl p-6 text-left transition-all hover:bg-lc-blue/5"
        >
          <div className="text-2xl mb-3">🔗</div>
          <p className="font-display font-bold text-white text-base">Join Room</p>
          <p className="text-lc-muted text-sm mt-1">Enter a 6-character room code</p>
        </button>
      </div>

      {/* Recent Battles */}
      <div>
        <h2 className="text-sm font-semibold text-lc-muted uppercase tracking-wider mb-4 font-mono">Recent Battles</h2>
        <div className="bg-lc-card border border-lc-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-lc-border">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-lc-green"></span>
              <div>
                <p className="font-semibold text-white text-sm">Won vs @ByteKing</p>
                <p className="text-xs text-lc-muted font-mono mt-0.5">Two Sum · Easy</p>
              </div>
            </div>
            <span className="text-lc-green font-mono font-bold text-sm">+15 ELO</span>
          </div>
          <div className="p-4 text-center text-lc-muted text-sm">
            Play more battles to see your history here.
          </div>
        </div>
      </div>

      {/* JOIN POPUP */}
      {showJoinPopup && !lobbyData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-lc-card border border-lc-border p-8 rounded-2xl w-96 shadow-2xl">
            <h3 className="font-display font-bold text-white text-xl mb-1">Join Room</h3>
            <p className="text-lc-muted text-sm mb-6">Enter the 6-character room code from your friend.</p>
            <form onSubmit={handleJoinSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="AB79X2"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                autoFocus
                className="bg-lc-bg border border-lc-border focus:border-lc-accent rounded-lg p-3 text-white text-center text-xl font-mono tracking-widest focus:outline-none"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowJoinPopup(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-medium">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-lc-accent hover:bg-lc-accent-hover rounded-lg text-black text-sm font-bold">
                  Join Battle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOBBY POPUP */}
      {lobbyData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="bg-lc-card border border-lc-border p-8 rounded-2xl max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="font-display font-bold text-white text-2xl mb-3">Waiting Lobby</h2>
              <div className="inline-flex items-center gap-3 bg-lc-bg border border-lc-border rounded-lg px-5 py-2">
                <span className="text-lc-muted text-xs font-mono">ROOM CODE</span>
                <span className="text-lc-accent font-mono text-xl font-bold tracking-widest">{lobbyData.roomId}</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-lc-muted text-xs font-mono uppercase tracking-wider mb-3">
                Players ({lobbyData.players?.length || 1})
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(lobbyData.players || [storedUser.username]).map((player, index) => (
                  <div key={index} className="flex items-center gap-3 bg-lc-bg border border-lc-border p-3 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lc-accent to-orange-600 flex items-center justify-center text-black font-bold text-sm">
                      {player ? player.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span className="font-medium text-white">{player}</span>
                    {index === 0 && (
                      <span className="ml-auto text-[10px] bg-lc-accent/20 text-lc-accent px-2 py-0.5 rounded font-mono uppercase">Host</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isGenerating ? (
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-8 h-8 border-[3px] border-lc-accent/30 border-t-lc-accent rounded-full animate-spin"></div>
                <p className="text-lc-accent font-mono text-xs">Fetching battle problem...</p>
              </div>
            ) : countdown !== null ? (
              <div className="text-center py-2">
                <p className="text-lc-muted text-sm mb-2 font-mono">Battle starts in</p>
                <div className="text-6xl font-black text-lc-accent">{countdown}</div>
              </div>
            ) : lobbyData.isHost ? (
              <button
                onClick={handleStartBattle}
                className="w-full bg-lc-accent hover:bg-lc-accent-hover text-black font-bold py-3.5 rounded-xl transition-all"
              >
                START BATTLE ⚔️
              </button>
            ) : (
              <div className="text-center py-3 text-lc-muted text-sm font-mono">
                Waiting for host to start...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}