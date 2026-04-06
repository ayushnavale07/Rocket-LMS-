const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://rocket-lms-v2.loca.lt',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const paymentRoutes = require('./routes/payment');
const forumRoutes = require('./routes/forum');
const reviewRoutes = require('./routes/review');
const aiRoutes = require('./routes/ai');
const newsletterRoutes = require('./routes/newsletter');

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/newsletter', newsletterRoutes);
// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rocket-lms')
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => {
        console.error('⚠️ MongoDB connection failed. Starting server in LIMITED MODE.');
        console.error('Error details:', err.message);
    });

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        dbState: mongoose.connection.readyState,
        usingFallback: !process.env.MONGODB_URI
    });
});

app.get('/', (req, res) => {
    res.send('Rocket LMS API is running...');
});
