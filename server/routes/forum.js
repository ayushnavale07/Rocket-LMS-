const express = require('express');
const router = express.Router();
const ForumTopic = require('../models/ForumTopic');
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

// Get all topics
router.get('/topics', async (req, res) => {
    try {
        const topics = await ForumTopic.find().populate('author', 'name avatar').sort({ createdAt: -1 });
        res.json(topics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a topic
router.post('/topics', verifyToken, async (req, res) => {
    const topic = new ForumTopic({
        title: req.body.title,
        content: req.body.content,
        author: req.userId,
        category: req.body.category
    });
    try {
        const newTopic = await topic.save();
        res.status(201).json(newTopic);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add a comment
router.post('/topics/:id/comments', verifyToken, async (req, res) => {
    try {
        const topic = await ForumTopic.findById(req.params.id);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });

        topic.comments.push({
            author: req.userId,
            content: req.body.content
        });
        await topic.save();
        res.status(201).json(topic);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a topic (Admin only)
router.delete('/topics/:id', verifyToken, async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Only admins can delete topics' });

        await ForumTopic.findByIdAndDelete(req.params.id);
        res.json({ message: 'Topic deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
