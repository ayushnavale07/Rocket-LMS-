const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-rocket-lms-key-2024';

// Init Razorpay with test keys fallback
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'thiswillbereplaced'
});

// Middleware for token verification
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.body.token || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error('Token error:', err.message, '| Token:', token?.substring(0, 20));
        res.status(401).json({ message: 'Invalid token. Please log out and log in again.' });
    }
};

// Step 1: Create Razorpay Order
router.post('/create-order', verifyToken, async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const user = await User.findById(req.userId);
        if (user.purchasedCourses && user.purchasedCourses.includes(courseId)) {
            return res.status(400).json({ message: 'Course already purchased' });
        }

        // Amount in paise (INR)
        const amountInPaise = Math.round(course.price * 100);
        
        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                courseId: courseId,
                userId: req.userId.toString(),
                courseName: course.title
            }
        });

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            courseTitle: course.title,
            coursePrice: course.price,
            userName: user.name,
            userEmail: user.email,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag'
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Failed to create payment order: ' + error.message });
    }
});

// Step 2: Verify Payment & Enroll
router.post('/verify-payment', verifyToken, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

        // Verify signature
        const keySecret = process.env.RAZORPAY_KEY_SECRET || 'thiswillbereplaced';
        const hmac = crypto.createHmac('sha256', keySecret);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed. Signature mismatch.' });
        }

        const user = await User.findById(req.userId);
        const course = await Course.findById(courseId);

        // Store Payment Record
        const payment = new Payment({
            user: req.userId,
            course: courseId,
            amount: course.price,
            transactionId: razorpay_payment_id,
            status: 'completed'
        });
        await payment.save();

        // Create Enrollment
        await Enrollment.create({ user: req.userId, course: courseId, progress: 0 });

        // Update User
        if (!user.purchasedCourses) user.purchasedCourses = [];
        user.purchasedCourses.push(courseId);
        await user.save();

        res.json({
            message: 'Enrollment successful!',
            transaction: {
                user: user.name,
                email: user.email,
                course: course.title,
                rate: course.price,
                paymentId: razorpay_payment_id,
                date: new Date()
            }
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ message: 'Enrollment failed: ' + error.message });
    }
});

// Legacy route (backward compat)
router.post('/initiate-order', verifyToken, async (req, res) => {
    return res.redirect(307, '/api/payment/create-order');
});

// Get payment history
router.get('/history/:userId', async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.params.userId, status: 'completed' })
            .populate('course').sort({ paidAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
