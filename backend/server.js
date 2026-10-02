const express=require('express');
const app=express();
const cors = require('cors');
const mongoose=require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');


app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());


app.use('/api/auth',authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('api is calling...');
});


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.log('❌ MongoDB Connection Error:', err));

const PORT=process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`🚀 Server running on port ${PORT}`);
})
