const express = require('express');
const router = express.Router();

// Mock AI Chat Logic
router.post('/chat', async (req, res) => {
    const { message } = req.body;

    // Simple rule-based AI for now
    let response = "I'm your Rocket LMS assistant! How can I help you today?";

    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('course') || lowerMsg.includes('learn')) {
        response = "We have many great courses in Web Development, Design, and more! Check out the Courses page.";
    } else if (lowerMsg.includes('buy') || lowerMsg.includes('payment')) {
        response = "Buying a course is easy! Just click 'Enroll Now' on any course page to start the payment process.";
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        response = "Hello! How can I assist you with your learning goals today?";
    } else if (lowerMsg.includes('forum')) {
        response = "Our Community Forums are a great place to share ideas and ask questions. Feel free to explore them!";
    }

    res.json({ response });
});

module.exports = router;
