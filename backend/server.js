const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const http = require('http');
const socket = require('socket.io');
const { generateQuestion } = require('./services/geminiService');

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('api is calling...');
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.log('❌ MongoDB Connection Error:', err));

const server = http.createServer(app);
const io = socket(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const roomsData = {};

io.on('connection', (socket) => {
    console.log(`new user connected ${socket.id}`);

    socket.on('createRoom', (userData) => {
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        socket.join(roomId);
        
        roomsData[roomId] = {
            hostId: userData.username,
            players: [userData.username]
        };

        console.log(`🏠 Room Created: ${roomId} by ${userData.username} (Host)`);
        
        socket.emit('roomCreated', { roomId, isHost: true, players: roomsData[roomId].players });
    });

   
    socket.on('joinRoom', ({ roomId, userData }) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        
        if (room && roomsData[roomId]) {
            socket.join(roomId);
            
           
            roomsData[roomId].players.push(userData.username);
            
            socket.emit('roomJoined', { roomId, isHost: false, players: roomsData[roomId].players });

            
            io.to(roomId).emit('playerJoined', {
                message: `${userData.username} joined the room`,
                players: roomsData[roomId].players
            });
        } else {
            socket.emit('roomError', 'Invalid Room Code!');
        }
    });

    socket.on('startBattle', async (roomId) => {
        if (roomsData[roomId] && roomsData[roomId].hostUsername === username) {
            console.log(`🚀 Host started battle in room ${roomId}. Generating AI question...`);

           
            io.to(roomId).emit('generatingQuestion', { 
                message: 'AI is crafting a unique battle scenario...' 
            });

            // Gemini API call
            const questionData = await generateQuestion();

            if (questionData) {
                
                roomsData[roomId].currentQuestion = questionData;

                
                io.to(roomId).emit('battleTimerStarted', { 
                    duration: 60,
                    message: 'Get Ready! Battle starts in 1 minute.',
                    question: questionData
                });
            } else {
                socket.emit('roomError', 'AI failed to generate question. Please try again.');
            }
        } else {
            socket.emit('roomError', 'Only the host can start the battle!');
        }
    });

    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});