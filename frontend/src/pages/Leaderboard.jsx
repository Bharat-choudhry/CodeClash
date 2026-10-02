import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view the arena rankings.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5005/api/users/leaderboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPlayers(data);
        } else {
          setError('Failed to fetch leaderboard data.');
        }
      } catch (err) {
        setError('Server connection error.');
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="w-full h-full bg-[#09090b] text-white p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-[#121214] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#facc15]">Top Coders Arena</h2>
        
        {error ? (
          <div className="text-red-500 text-center mb-4 p-4 bg-red-500/10 rounded-lg">{error}</div>
        ) : (
          <div className="space-y-3">
            {players.map((player, index) => (
              <div 
                key={player._id} 
                className="flex items-center justify-between bg-[#09090b] p-4 rounded-lg border border-white/5 hover:border-[#facc15]/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className={`text-xl font-bold w-8 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                    #{index + 1}
                  </span>
                  <span className="text-lg font-semibold">{player.username}</span>
                </div>
                <div className="flex items-center gap-2 text-[#facc15] font-bold">
                  <span>{player.elo}</span>
                  <span className="text-xs text-gray-400 font-normal mt-1">ELO</span>
                </div>
              </div>
            ))}
            
            {players.length === 0 && !error && (
              <div className="text-center text-gray-500 py-8">No players found in the arena yet.</div>
            )}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}