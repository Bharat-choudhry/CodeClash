import React ,{useState}from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
 const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async(e) => {
    e.preventDefault();
    try{
      const response= await fetch('http://localhost:5005/api/auth/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await response.json();
      if(response.ok){
        alert(data.message + " Please log in to continue.");
        navigate('/login');
      } else {
        alert(data.message || "Registration failed");
      }
    }catch (error) {
      console.error("Error:", error);
    }
    
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-white flex items-center justify-center relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 bg-[#121214] border border-white/10 rounded-2xl relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Join the Arena</h2>
          <p className="text-gray-400 text-sm">Create an account to start battling</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
            <input 
              type="text"
              name="username"
              value={formData.username} 
               onChange={handleChange} 
              required 
              placeholder="CodeNinja" 
              className="w-full bg-[#09090b] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#facc15] transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email"
              name="email"
              value={formData.email} 
              onChange={handleChange}
              required 
              placeholder="coder@example.com" 
              className="w-full bg-[#09090b] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#facc15] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input 
              type="password"
              name="password" 
              value={formData.password} 
              onChange={handleChange}
              required 
              placeholder="••••••••" 
              className="w-full bg-[#09090b] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#facc15] transition-colors"
            />
          </div>

          <button type="submit" className="w-full bg-white text-black font-bold py-3.5 rounded-lg hover:bg-gray-200 transition-colors mt-2">
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button onClick={() => navigate('/login')} className="text-white hover:text-[#facc15] font-semibold transition-colors">
            Log in here
          </button>
        </div>
      </div>
    </div>
  );
}