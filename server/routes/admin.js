const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Get Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCourses = await Course.countDocuments();
        const totalEnrollments = await Enrollment.countDocuments();

        const recentPayments = await Payment.find({ status: 'completed' })
            .populate('user', 'name email')
            .populate('course', 'title')
            .sort({ paidAt: -1 })
            .limit(10);

        const categoryStats = await Course.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.json({
            revenue: totalRevenue[0]?.total || 0,
            students: totalStudents,
            courses: totalCourses,
            enrollments: totalEnrollments,
            recentPayments,
            categoryStats
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

module.exports = router;
