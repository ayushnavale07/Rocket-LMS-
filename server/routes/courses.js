const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

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
            // Management
            { title: "Excel from Beginner to Advanced", instructor: "Robert Ransdell", price: 80, originalPrice: 100, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400", category: "Management", rating: 4.5, reviewsCount: 156, duration: "140 Hours", type: "Course" },
            { title: "Corporate Management", instructor: "Ricardo Dave", price: 85, originalPrice: 110, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400", category: "Management", rating: 4.8, reviewsCount: 92, duration: "4:00 Hours", type: "Course" },

            // Web Development
            { title: "New In-App Live System", instructor: "Robert Ransdell", price: 10, originalPrice: 15, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400", category: "Web Development", rating: 4.8, reviewsCount: 210, duration: "2:50 Hours", type: "Course" },
            { title: "Backend Development with Node.js", instructor: "Kate Williams", price: 25, originalPrice: 35, image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400", category: "Web Development", rating: 4.8, reviewsCount: 120, duration: "3:10 Hours", type: "Course" },
            { title: "Mobile App Development with React Native", instructor: "Robert Ransdell", price: 30, originalPrice: 50, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400", category: "Web Development", rating: 4.5, reviewsCount: 85, duration: "3:50 Hours", type: "Course" },
            { title: "Full Stack JavaScript Development", instructor: "James Kong", price: 80, originalPrice: 100, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400", category: "Web Development", rating: 4.9, reviewsCount: 45, duration: "3:40 Hours", type: "Course" },
            { title: "Advanced React Patterns", instructor: "Kate Williams", price: 90, originalPrice: 120, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400", category: "Web Development", rating: 4.9, reviewsCount: 67, duration: "4:15 Hours", type: "Course" },
            { title: "Cybersecurity Fundamentals", instructor: "James Kong", price: 45, originalPrice: 60, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400", category: "Web Development", rating: 4.7, reviewsCount: 55, duration: "3:30 Hours", type: "Course" },

            // Design
            { title: "Accessibility in UI/UX Design", instructor: "Ricardo Dave", price: 55, originalPrice: 70, image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400", category: "Design", rating: 4.6, reviewsCount: 78, duration: "2:50 Hours", type: "Course" },
            { title: "Figma for UI/UX Designers", instructor: "Affogato Media", price: 65, originalPrice: 80, image: "https://images.unsplash.com/photo-1581291518655-9524ec9700f3?auto=format&fit=crop&q=80&w=400", category: "Design", rating: 4.7, reviewsCount: 112, duration: "3:10 Hours", type: "Course" },
            { title: "UI Animation and Micro-interactions", instructor: "Jessica Wray", price: 25, originalPrice: 35, image: "https://images.unsplash.com/photo-1550439062-60911503d2fe?auto=format&fit=crop&q=80&w=400", category: "Design", rating: 4.8, reviewsCount: 89, duration: "2:20 Hours", type: "Course" },
            { title: "Design Systems Workshop", instructor: "James Kong", price: 110, originalPrice: 150, image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=400", category: "Design", rating: 4.9, reviewsCount: 200, duration: "2:40 Hours", type: "Live Class" },
            { title: "Mobile UI Design Patterns", instructor: "John Powe", price: 70, originalPrice: 90, image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&q=80&w=400", category: "Design", rating: 4.5, reviewsCount: 120, duration: "3:00 Hours", type: "Course" },
            { title: "Graphic Design Masterclass", instructor: "Affogato Media", price: 40, originalPrice: 60, image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=400", category: "Design", rating: 4.7, reviewsCount: 300, duration: "5:00 Hours", type: "Course" },

            // Science
            { title: "Python for Data Science", instructor: "Linda Anderson", price: 10, originalPrice: 20, image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400", category: "Science", rating: 4.7, reviewsCount: 320, duration: "3:20 Hours", type: "Course" },
            { title: "Machine Learning Basics", instructor: "Linda Anderson", price: 0, originalPrice: 0, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=400", category: "Science", rating: 4.4, reviewsCount: 500, duration: "2:30 Hours", type: "Text Lesson" },
            { title: "AI Ethics and Future", instructor: "Linda Anderson", price: 0, originalPrice: 0, image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400", category: "Science", rating: 4.5, reviewsCount: 150, duration: "1:20 Hours", type: "Text Lesson" },

            // Marketing
            { title: "Digital Marketing 101", instructor: "John Powe", price: 15, originalPrice: 25, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400", category: "Marketing", rating: 4.3, reviewsCount: 410, duration: "3:10 Hours", type: "Course" },
            { title: "SEO Mastery", instructor: "John Powe", price: 30, originalPrice: 45, image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=400", category: "Marketing", rating: 4.4, reviewsCount: 215, duration: "2:50 Hours", type: "Course" },

            // Business Strategy
            { title: "Business Strategy for Startups", instructor: "Robert Ransdell", price: 50, originalPrice: 75, image: "https://images.unsplash.com/photo-1454165833772-d99628a5ffa0?auto=format&fit=crop&q=80&w=400", category: "Business Strategy", rating: 4.6, reviewsCount: 180, duration: "2:45 Hours", type: "Live Class" },
            { title: "Public Speaking Secrets", instructor: "Ricardo Dave", price: 25, originalPrice: 40, image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=400", category: "Business Strategy", rating: 4.8, reviewsCount: 130, duration: "3:00 Hours", type: "Live Class" },

            // Lifestyle & Other
            { title: "Lifestyle & Productivity", instructor: "Jessica Wray", price: 12, originalPrice: 18, image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400", category: "Lifestyle", rating: 4.5, reviewsCount: 60, duration: "1:50 Hours", type: "Text Lesson" },
            { title: "Photography for Beginners", instructor: "Robert Ransdell", price: 15, originalPrice: 30, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400", category: "Lifestyle", rating: 4.5, reviewsCount: 110, duration: "2:40 Hours", type: "Course" },
            { title: "Nutrition for Athletes", instructor: "Jessica Wray", price: 18, originalPrice: 25, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400", category: "Health & Fitness", rating: 4.7, reviewsCount: 45, duration: "2:10 Hours", type: "Course" }
        ];

        await Course.deleteMany({});
        await Course.insertMany(courses);
        res.status(201).json({ message: 'Courses seeded' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

const Enrollment = require('../models/Enrollment');

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

module.exports = router;
