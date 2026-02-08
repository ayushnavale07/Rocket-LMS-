const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rocket_lms';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('CRITICAL: MongoDB connection error:', err.message);
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
