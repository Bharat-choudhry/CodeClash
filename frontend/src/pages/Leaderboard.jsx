import React, { useState, useEffect } from 'react';

const MEDAL = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setError('Please login to view rankings.'); setLoading(false); return; }
      try {
        const res = await fetch('http://localhost:5005/api/users/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setPlayers(await res.json());
        else setError('Failed to load leaderboard.');
      } catch {
        setError('Server connection error.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-white">Leaderboard</h1>
        <p className="text-lc-muted text-sm mt-1">Top coders ranked by ELO rating</p>
      </div>

      <div className="bg-lc-card border border-lc-border rounded-2xl overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-3 px-5 py-3 border-b border-lc-border text-xs font-mono text-lc-muted uppercase tracking-wider">
          <span>#</span>
          <span>Username</span>
          <span className="text-right">ELO</span>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-lc-accent/30 border-t-lc-accent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="text-lc-red text-sm text-center py-8">{error}</div>
        )}

        {!loading && !error && players.length === 0 && (
          <div className="text-lc-muted text-sm text-center py-12">No players yet. Start battling!</div>
        )}

        {players.map((player, index) => {
          const isTop3 = index < 3;
          return (
            <div
              key={player._id}
              className={`grid grid-cols-3 items-center px-5 py-4 border-b border-lc-border last:border-0 hover:bg-white/[0.02] transition-colors ${isTop3 ? 'bg-lc-accent/[0.03]' : ''}`}
            >
              <span className="font-bold text-lg">
                {MEDAL[index] || <span className="text-lc-muted font-mono text-sm">#{index + 1}</span>}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lc-accent to-orange-600 flex items-center justify-center text-black font-bold text-xs">
                  {player.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{player.username}</p>
                  <p className="text-lc-muted text-xs font-mono">{player.matchesPlayed || 0} battles</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`font-mono font-black text-base ${
                  index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-lc-accent'
                }`}>
                  {player.elo}
                </span>
                <p className="text-lc-muted text-xs font-mono">ELO</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}