const User = require('../models/User');

const getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.find()
            .sort({ elo: -1 }) 
            .limit(10)         
            .select('username elo _id');

        res.status(200).json(topUsers);
    } catch (error) {
        console.error("Leaderboard Error:", error);
        res.status(500).json({ error: "Leaderboard load karne mein dikkat aayi" });
    }
};

const getUserProfile = async (req, res) => {
    try {
        
        const user = await User.findById(req.user.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ error: "do not load Profile " });
    }
};

module.exports = { getLeaderboard, getUserProfile };