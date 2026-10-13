const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const http = require('http');
const socket = require('socket.io');
const { fetchLeetCodeQuestion } = require('./services/leetcodeService');
const { evaluateCode } = require('./services/geminiService');
const User = require('./models/User');

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.get('/', (req, res) => res.send('api is calling...'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.log('❌ MongoDB Connection Error:', err));

const server = http.createServer(app);
const io = socket(server, {
    cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'], credentials: true }
});

const roomsData = {};
const BATTLE_DURATION = 20 * 60; // 20 minutes in seconds
const ELO_STAKE = 20;
const WIN_RATIOS = [0.5, 0.3, 0.2];

// Zero-sum ELO calculation
async function finalizeBattle(roomId) {
    const room = roomsData[roomId];
    if (!room || room.battleEnded) return;
    room.battleEnded = true;

    if (room.battleTimer) clearTimeout(room.battleTimer);

    const players = room.players; // array of usernames
    const submissions = room.submissions || {};

    // Build ranked list: correct + faster first, then incorrect/no-submit
    const ranked = players
        .map(username => {
            const sub = submissions[username];
            return {
                username,
                isCorrect: sub?.isCorrect || false,
                submittedAt: sub?.submittedAt || Infinity,
                verdict: sub?.verdict || 'No Submission',
            };
        })
        .sort((a, b) => {
            if (a.isCorrect !== b.isCorrect) return b.isCorrect - a.isCorrect;
            return a.submittedAt - b.submittedAt;
        });

    const correctCount = ranked.filter(r => r.isCorrect).length;
    const winnerCount = Math.min(3, correctCount);
    const losers = ranked.slice(winnerCount);
    const winners = ranked.slice(0, winnerCount);

    const pool = losers.length * ELO_STAKE;
    const eloChanges = {};

    // Winners gain from pool
    const ratios = winnerCount === 1 ? [1] : winnerCount === 2 ? [0.6, 0.4] : WIN_RATIOS;
    winners.forEach((w, i) => {
        eloChanges[w.username] = Math.round(pool * ratios[i]);
    });

    // Losers each lose STAKE
    losers.forEach(l => {
        eloChanges[l.username] = -ELO_STAKE;
    });

    // If no losers (everyone correct), rank by time — bottom players are "relative losers"
    if (losers.length === 0 && players.length > 1) {
        const relLosers = ranked.slice(winnerCount > 0 ? winnerCount : 1);
        const relWinners = ranked.slice(0, winnerCount > 0 ? winnerCount : 1);
        const relPool = relLosers.length * ELO_STAKE;
        relLosers.forEach(l => { eloChanges[l.username] = -ELO_STAKE; });
        relWinners.forEach((w, i) => {
            eloChanges[w.username] = Math.round(relPool * (ratios[i] || 0));
        });
    }

    // Update ELO in DB
    await Promise.all(
        players.map(username =>
            User.findOneAndUpdate(
                { username },
                { $inc: { elo: eloChanges[username] || 0, matchesPlayed: 1 } }
            )
        )
    );

    const results = ranked.map((r, index) => ({
        rank: index + 1,
        username: r.username,
        verdict: r.verdict,
        eloChange: eloChanges[r.username] || 0,
    }));

    console.log(`🏁 Battle ended in room ${roomId}. Results:`, results);
    io.to(roomId).emit('battleResult', { results });

    delete roomsData[roomId];
}

io.on('connection', (socket) => {
    console.log(`new user connected ${socket.id}`);

    socket.on('createRoom', (userData) => {
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        socket.join(roomId);
        roomsData[roomId] = {
            hostId: userData.username,
            players: [userData.username],
            submissions: {},
            battleEnded: false,
            battleTimer: null,
        };
        console.log(`🏠 Room Created: ${roomId} by ${userData.username}`);
        socket.emit('roomCreated', { roomId, isHost: true, players: roomsData[roomId].players });
    });

    socket.on('joinRoom', ({ roomId, userData }) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        if (room && roomsData[roomId]) {
            socket.join(roomId);
            roomsData[roomId].players.push(userData.username);
            socket.emit('roomJoined', { roomId, isHost: false, players: roomsData[roomId].players });
            io.to(roomId).emit('playerJoined', { players: roomsData[roomId].players });
        } else {
            socket.emit('roomError', 'Invalid Room Code!');
        }
    });

    socket.on('startBattle', async ({ roomId, username }) => {
        if (!roomsData[roomId] || roomsData[roomId].hostId !== username) {
            return socket.emit('roomError', 'Only the host can start the battle!');
        }

        console.log(`🚀 Battle started in room ${roomId}. Fetching LeetCode question...`);
        io.to(roomId).emit('generatingQuestion', {});

        const questionData = await fetchLeetCodeQuestion();
        if (!questionData) {
            return socket.emit('roomError', 'Failed to fetch question. Please try again.');
        }

        roomsData[roomId].currentQuestion = questionData;

        // Start 20-min server-side timer
        roomsData[roomId].battleTimer = setTimeout(() => {
            console.log(`⏰ Time up for room ${roomId}. Finalizing...`);
            finalizeBattle(roomId);
        }, BATTLE_DURATION * 1000);

        io.to(roomId).emit('battleTimerStarted', {
            lobbyCountdown: 60,
            battleDuration: BATTLE_DURATION,
            question: questionData,
        });
    });

    socket.on('submitCode', async ({ roomId, username, code }) => {
        const room = roomsData[roomId];
        if (!room || !room.currentQuestion || room.battleEnded) {
            return socket.emit('codeResult', { error: 'No active battle found.' });
        }

        // Don't allow re-submit if already correct
        if (room.submissions[username]?.isCorrect) {
            return socket.emit('codeResult', { already: true, verdict: 'Already Accepted', feedback: 'You already submitted a correct solution!' });
        }

        console.log(`📝 ${username} submitted code in room ${roomId}. Evaluating...`);
        const evalResult = await evaluateCode(code, room.currentQuestion);

        room.submissions[username] = {
            isCorrect: evalResult.isCorrect,
            verdict: evalResult.verdict,
            submittedAt: Date.now(),
        };

        socket.emit('codeResult', evalResult);

        // Broadcast live leaderboard update to all in room
        const liveRankings = room.players.map(p => ({
            username: p,
            solved: room.submissions[p]?.isCorrect || false,
            verdict: room.submissions[p]?.verdict || 'Coding...',
        })).sort((a, b) => b.solved - a.solved);
        io.to(roomId).emit('liveRankings', liveRankings);

        // Auto-end if all players have submitted correctly
        const allSolved = room.players.every(p => room.submissions[p]?.isCorrect);
        if (allSolved) {
            console.log(`✅ All players solved in room ${roomId}. Ending early...`);
            finalizeBattle(roomId);
        }
    });

    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));