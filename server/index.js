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
        // Allow all origins for the live demo to ensure connectivity
        // In a strict production app, you would list only your vercel.app domain here
        if (!origin || origin.includes('vercel.app') || origin.includes('localhost') || origin.includes('loca.lt')) {
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

app.get('/api/test-deploy', (req, res) => {
    res.json({ message: "🚀 DEPLOYMENT SUCCESSFUL - V3", time: new Date().toISOString() });
});

app.get('/api/admin/seed-production', async (req, res) => {
    try {
        const Course = require('./models/Course');
        const dummyCourses = [
            {
                title: "Excel from Beginner to Advanced",
                instructor: "Robert Ransdell",
                price: 80,
                oldPrice: 100,
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
                rating: 5,
                duration: "140 Hours",
                category: "Management",
                description: "Master Excel from basic formulas to advanced data analysis and automation.",
                students: 1200,
                lessons: 45
            },
            {
                title: "Corporate Management Mastery",
                instructor: "Ricardo Dave",
                price: 85,
                oldPrice: 110,
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
                rating: 5,
                duration: "4:00 Hours",
                category: "Management",
                description: "Learn the secrets of effective corporate leadership and organizational strategy.",
                students: 850,
                lessons: 22
            },
            {
                title: "Full Stack Web Development 2024",
                instructor: "Admin",
                price: 150,
                oldPrice: 200,
                image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
                rating: 5,
                duration: "250 Hours",
                category: "Programming",
                description: "Go from zero to hero in React, Node.js, and MongoDB.",
                students: 3500,
                lessons: 120
            },
            {
                title: "UI/UX Design for Modern Apps",
                instructor: "Linda Anderson",
                price: 45,
                oldPrice: 60,
                image: "https://images.unsplash.com/photo-1541462608141-ad4d05945035?w=400",
                rating: 4.5,
                duration: "35 Hours",
                category: "Design",
                description: "Create stunning interfaces and user experiences using Figma and Adobe XD.",
                students: 2100,
                lessons: 30
            },
            {
                title: "Digital Marketing Strategy 2024",
                instructor: "Robert Ransdell",
                price: 65,
                oldPrice: 90,
                image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c1d1?w=400",
                rating: 4.8,
                duration: "50 Hours",
                category: "Marketing",
                description: "Grow your business using social media, SEO, and paid advertising.",
                students: 1800,
                lessons: 40
            }
        ];

        await Course.deleteMany({});
        await Course.insertMany(dummyCourses);
        res.json({ message: "✅ Production Database Seeded Successfully with Premium Courses!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Rocket LMS API is running...');
});
