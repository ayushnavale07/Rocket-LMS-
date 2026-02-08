const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = jwt.verify(token.split(' ')[1] || token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Get reviews (filter by course or website)
router.get('/', async (req, res) => {
    const { courseId, type } = req.query;
    let query = {};
    if (courseId) query.course = courseId;
    if (type) query.type = type;

    try {
        const reviews = await Review.find(query).populate('user', 'name avatar').sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Post a review
router.post('/', verifyToken, async (req, res) => {
    const review = new Review({
        user: req.userId,
        course: req.body.courseId,
        rating: req.body.rating,
        comment: req.body.comment,
        type: req.body.type || 'course'
    });
    try {
        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
