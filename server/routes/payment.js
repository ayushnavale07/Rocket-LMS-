const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware for token verification
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'] || req.body.token;
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = jwt.verify(token.split(' ')[1] || token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Step 1: Initiate Order
router.post('/initiate-order', verifyToken, async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const user = await User.findById(req.userId);
        if (user.purchasedCourses.includes(courseId)) {
            return res.status(400).json({ message: 'Course already purchased' });
        }

        // Return order details for frontend checkout summary
        res.json({
            orderId: `ORDER_${Date.now()}`,
            courseTitle: course.title,
            amount: course.price,
            email: user.email,
            userName: user.name
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Step 2: Verify and Finalize Purchase
router.post('/verify-payment', verifyToken, async (req, res) => {
    try {
        const { courseId, transactionId, amount } = req.body;

        const user = await User.findById(req.userId);
        const course = await Course.findById(courseId);

        // Store Payment Record
        const payment = new Payment({
            user: req.userId,
            course: courseId,
            amount: amount,
            transactionId: transactionId || `TXN_${Date.now()}`,
            status: 'completed'
        });
        await payment.save();

        // Create Enrollment
        const enrollment = new Enrollment({
            user: req.userId,
            course: courseId,
            progress: 0
        });
        await enrollment.save();

        // Update User purchasedCourses
        user.purchasedCourses.push(courseId);
        await user.save();

        res.json({
            message: 'Enrollment successful!',
            transaction: {
                user: user.name,
                email: user.email,
                course: course.title,
                rate: amount,
                date: payment.paidAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Enrollment failed' });
    }
});

// Get payment history for a user
router.get('/history/:userId', async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.params.userId, status: 'completed' })
            .populate('course')
            .sort({ paidAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
