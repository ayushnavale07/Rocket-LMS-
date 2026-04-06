const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = "mongodb+srv://admin:RocketLMS123@ayushcluster.xq8gj.mongodb.net/rocket-lms?retryWrites=true&w=majority&appName=ayushcluster";

const Course = mongoose.model('Course', new mongoose.Schema({
    title: String,
    instructor: String,
    price: Number,
    oldPrice: Number,
    image: String,
    rating: Number,
    duration: String,
    category: String,
    description: String,
    students: Number,
    lessons: Number,
    createdAt: { type: Date, default: Date.now }
}));

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

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB Atlas for final seeding...");
        
        // Clear existing courses to avoid duplicates
        await Course.deleteMany({});
        
        await Course.insertMany(dummyCourses);
        console.log("✅ 5 Premium Courses seeded successfully!");
        
        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seed();
