import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Arena from "./pages/Arena";
import Layout from "./components/layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/register";
import Leaderboard from "./pages/Leaderboard";
import Profile from  "./pages/Profile";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
         <Route path="/arena/:roomId" element={<Arena />} />
      </Routes>
    </Router>
  );
}

export default App;