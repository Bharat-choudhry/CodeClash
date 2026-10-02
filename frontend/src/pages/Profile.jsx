
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5005/api/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setError('Failed to fetch profile data.');
        }
      } catch (err) {
        setError('Server connection error.');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Jab tak data load ho raha hai
  if (!user && !error) {
    return <div className="w-full h-full flex justify-center items-center text-gray-400">Loading Profile...</div>;
  }

  return (
    <div className="w-full h-full bg-[#09090b] text-white p-8 flex flex-col items-center">
      
      {error ? (
        <div className="text-red-500 p-4 bg-red-500/10 rounded-lg">{error}</div>
      ) : (
        <div className="w-full max-w-md bg-[#121214] border border-white/10 rounded-2xl p-8 shadow-2xl mt-10">
          <div className="flex flex-col items-center">
            
            {/* Avatar Circle (Naam ka pehla letter) */}
            <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-amber-600 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-lg text-black">
              {user.username.charAt(0).toUpperCase()}
            </div>
            
            <h2 className="text-3xl font-bold mb-1">{user.username}</h2>
            <p className="text-gray-400 mb-8">{user.email}</p>
            
            {/* Stats Box */}
            <div className="w-full bg-[#09090b] border border-white/5 rounded-xl p-5 flex justify-between items-center mb-8 shadow-inner">
              <span className="text-gray-300 font-medium">Arena ELO Rating</span>
              <span className="text-3xl font-bold text-[#facc15]">{user.elo}</span>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-bold py-3.5 rounded-lg transition-all"
            >
              Sign Out
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
}