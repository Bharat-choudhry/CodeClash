import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      try {
        const res = await fetch('http://localhost:5005/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setUser(await res.json());
        else setError('Failed to load profile.');
      } catch {
        setError('Server connection error.');
      }
    };
    fetchProfile();
  }, [navigate]);

  if (!user && !error) return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="w-6 h-6 border-2 border-lc-accent/30 border-t-lc-accent rounded-full animate-spin"></div>
    </div>
  );

  const rank = user?.elo >= 2000 ? 'Grandmaster' : user?.elo >= 1600 ? 'Expert' : user?.elo >= 1400 ? 'Specialist' : 'Newbie';
  const rankColor = user?.elo >= 2000 ? 'text-red-500' : user?.elo >= 1600 ? 'text-purple-400' : user?.elo >= 1400 ? 'text-lc-blue' : 'text-lc-muted';

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="font-display font-bold text-2xl text-white mb-6">My Profile</h1>

      {error ? (
        <div className="text-lc-red bg-lc-red/10 border border-lc-red/30 rounded-xl p-4">{error}</div>
      ) : user && (
        <div className="space-y-4">
          {/* Avatar + Name */}
          <div className="bg-lc-card border border-lc-border rounded-2xl p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-lc-accent to-orange-600 flex items-center justify-center text-2xl font-black text-black shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-xl">{user.username}</h2>
              <p className="text-lc-muted text-sm">{user.email}</p>
              <span className={`text-xs font-semibold mt-1 inline-block ${rankColor}`}>{rank}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-lc-card border border-lc-border rounded-xl p-5">
              <p className="text-lc-muted text-xs font-mono uppercase tracking-wider mb-1">ELO Rating</p>
              <p className="font-mono font-black text-3xl text-lc-accent">{user.elo}</p>
            </div>
            <div className="bg-lc-card border border-lc-border rounded-xl p-5">
              <p className="text-lc-muted text-xs font-mono uppercase tracking-wider mb-1">Battles Played</p>
              <p className="font-mono font-black text-3xl text-white">{user.matchesPlayed || 0}</p>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }}
            className="w-full border border-lc-red/30 text-lc-red hover:bg-lc-red hover:text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}