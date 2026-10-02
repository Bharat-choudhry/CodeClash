
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  elo: { 
    type: Number, 
    default: 1200 // Naye user ki default rating
  },
  matchesPlayed: {
    type: Number,
    default: 0
  }
}, { timestamps: true }); // timestamps se createdAt aur updatedAt apne aap ban jayenge

module.exports = mongoose.model('User', userSchema);