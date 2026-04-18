const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all bundles
router.get('/bundles', async (req, res) => {
    try {
        const Bundle = require('../models/Bundle');
        const bundles = await Bundle.find().populate('courses');
        res.json(bundles);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Seed data route (Internal or for testing)
router.post('/seed', async (req, res) => {
    try {
        const courses = [
            { title: "Web Development Course", instructor: "Kate Williams", price: 25, originalPrice: 35, image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400", category: "Web Development", rating: 4.8, reviewsCount: 120, duration: "3:10 Hours", type: "Course" },
            { title: "AWS Cloud Expert", instructor: "Robert Ransdell", price: 80, originalPrice: 100, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400", category: "Technology", rating: 4.9, reviewsCount: 156, duration: "6:20 Hours", type: "Course" },
            { title: "Graphic Designing Course", instructor: "Affogato Media", price: 40, originalPrice: 60, image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=400", category: "Design", rating: 4.7, reviewsCount: 300, duration: "5:00 Hours", type: "Course" },
            { title: "Java Full Stack Course", instructor: "James Kong", price: 90, originalPrice: 120, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400", category: "Web Development", rating: 4.9, reviewsCount: 200, duration: "10:40 Hours", type: "Course" },
            { title: "MS Office Masterclass", instructor: "Ricardo Dave", price: 15, originalPrice: 30, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400", category: "Management", rating: 4.5, reviewsCount: 92, duration: "2:00 Hours", type: "Course" },
            { title: "App Development Course", instructor: "John Powe", price: 60, originalPrice: 85, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400", category: "Technology", rating: 4.8, reviewsCount: 120, duration: "4:50 Hours", type: "Course" },
            { title: "WordPress Complete Guide", instructor: "Linda Anderson", price: 20, originalPrice: 35, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400", category: "Web Development", rating: 4.6, reviewsCount: 85, duration: "2:40 Hours", type: "Course" },
            { title: "UI/UX Design Bootcamp", instructor: "Jessica Wray", price: 55, originalPrice: 75, image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400", category: "Design", rating: 4.9, reviewsCount: 400, duration: "8:00 Hours", type: "Course" }
        ];

        await Course.deleteMany({});
        await Course.insertMany(courses);
        res.status(201).json({ message: 'Courses seeded' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

const Enrollment = require('../models/Enrollment');

// Search courses
router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        if (!query) return res.json([]);
        const courses = await Course.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get enrolled courses for a user
router.get('/enrolled/:userId', async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.params.userId, status: 'active' })
            .populate('course');
        const courses = enrollments.map(e => e.course);
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a single course
router.post('/', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Update a course
router.put('/:id', async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Delete a course
router.delete('/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

module.exports = router;
