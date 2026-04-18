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
const adminRoutes = require('./routes/admin');
const eventsRoutes = require('./routes/events');
const storeRoutes = require('./routes/store');

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/store', storeRoutes);
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

// Dynamic Public Stats for Home Page
app.get('/api/general-stats', async (req, res) => {
    try {
        const Course = require('./models/Course');
        const User = require('./models/User');
        const instructors = await User.countDocuments({ role: 'admin' }); // Assuming admins are instructors for now
        const students = await User.countDocuments({ role: 'student' });
        const courses = await Course.countDocuments();
        const categories = await Course.distinct('category');
        
        // Count courses per category
        const categoryCounts = await Course.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        res.json({
            instructors: instructors + 120, // Adding baseline for demo if empty
            students: students + 400,
            courses: courses,
            organizations: 6,
            categoryCounts: categoryCounts.map(c => ({ name: c._id, count: c.count }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/seed-admin', async (req, res) => {
    try {
        const User = require('./models/User');
        const bcrypt = require('bcryptjs');
        
        // Delete existing admin to ensure fresh credentials
        await User.deleteOne({ email: 'admin@rocketlms.org' });

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            name: 'Admin',
            email: 'admin@rocketlms.org',
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        res.json({ message: "✅ Admin account created/reset: admin@rocketlms.org / admin123" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/seed-production', async (req, res) => {
    try {
        const Course = require('./models/Course');
        const dummyCourses = [
            { title: "Web Development Course", instructor: "Kate Williams", price: 25, originalPrice: 35, image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400", category: "Web Development", rating: 5, reviewsCount: 120, duration: "3:10 Hours", type: "Course" },
            { title: "AWS Cloud Expert", instructor: "Robert Ransdell", price: 80, originalPrice: 100, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400", category: "Technology", rating: 5, reviewsCount: 156, duration: "6:20 Hours", type: "Course" },
            { title: "Health And Fitness Masterclass", instructor: "Jessica Wray", price: 25, originalPrice: 35, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", category: "Health & Fitness", rating: 5, reviewsCount: 300, duration: "5:00 Hours", type: "Course" },
            { title: "Introduction to Python (Free)", instructor: "James Kong", price: 0, originalPrice: 20, image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400", category: "Web Development", rating: 4, reviewsCount: 50, duration: "1:30 Hours", type: "Course" },
            { title: "Digital Marketing 101", instructor: "Linda Anderson", price: 15, originalPrice: 30, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400", category: "Marketing", rating: 4.8, reviewsCount: 92, duration: "2:00 Hours", type: "Course" }
        ];

        await Course.deleteMany({});
        const courses = await Course.insertMany(dummyCourses);

        // Seed Bundles
        const Bundle = require('./models/Bundle');
        const dummyBundles = [
            { 
                title: "Ultimate Dev Mastery Bundle", 
                courses: [courses[0]._id, courses[3]._id], 
                price: 20, 
                originalPrice: 45, 
                image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400",
                instructor: "Full Stack Team" 
            },
            {
                title: "Become a Probability & Statistics Master",
                courses: [courses[1]._id],
                price: 25,
                originalPrice: 50,
                image: "https://images.unsplash.com/photo-1543286386-713bcd53efa7?w=400",
                instructor: "Prof. Sarah Johnson"
            }
        ];
        await Bundle.deleteMany({});
        await Bundle.insertMany(dummyBundles);

        // Seed Events
        const Event = require('./models/Event');
        const dummyEvents = [
            { id: 'event-1', title: 'DevOps and CI/CD Automation', tutor: 'Robert Ransdell', price: 20, date: 'June 30', status: 'Ongoing', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400' },
            { id: 'event-2', title: 'Blockchain Development', tutor: 'Robert Ransdell', price: 15, date: 'June 12', status: 'Completed', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400' }
        ];
        await Event.deleteMany({});
        await Event.insertMany(dummyEvents);

        // Seed Store
        const Product = require('./models/Product');
        const dummyProducts = [
            { title: 'Premium Learning Notebook', price: 15, oldPrice: 20, category: 'Stationery', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400' },
            { title: 'Tech Backpack', price: 45, oldPrice: 60, category: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' }
        ];
        await Product.deleteMany({});
        await Product.insertMany(dummyProducts);

        res.json({ message: "✅ Production Database Seeded Successfully with Courses, Events, and Store items!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Rocket LMS API is running...');
});
