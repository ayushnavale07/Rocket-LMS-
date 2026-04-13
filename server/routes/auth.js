server - routes - auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Register / Suppress "Already Exists"
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic format check
        if (!email.includes('@') || !/[a-zA-Z]/.test(email)) {
            return res.status(400).json({ message: 'Email must contain alphabets and @ symbol' });
        }

        let user = await User.findOne({ email });

        // If user already exists, just log them in instead of erroring
        if (user) {
            const token = jwt.sign({ userId: user._id }, JWT_SECRET);
            return res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name: name || 'User', email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Login / Proper Auth
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        // Basic format check
        if (!email.includes('@') || !/[a-zA-Z]/.test(email)) {
            return res.status(400).json({ message: 'Email must contain alphabets and @ symbol' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            console.log(`User not found: ${email}. Creating new user (Auto-Signup).`);
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ name: 'User', email, password: hashedPassword });
            await user.save();
        } else {
            // Proper password check for existing users
            console.log(`Checking password for existing user: ${email}`);
            console.log(`Password in DB starts with: ${user.password.substring(0, 4)}`);

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                // Fallback check: if the stored password IS the plain password (not recommended, but for migration)
                if (password === user.password) {
                    console.log(`WARNING: User ${email} had plain text password. UPGRADING to hash.`);
                    const newHash = await bcrypt.hash(password, 10);
                    user.password = newHash;
                    await user.save();
                } else {
                    console.log(`Password mismatch for: ${email}`);
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
            }
            console.log(`Login successful for: ${email}`);
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

module.exports = router;

