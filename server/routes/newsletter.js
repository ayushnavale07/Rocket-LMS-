const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const existing = await Newsletter.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already subscribed' });

        const sub = new Newsletter({ email });
        await sub.save();
        res.status(201).json({ message: 'Successfully subscribed to newsletter!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
