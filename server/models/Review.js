const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Optional, can be site-wide
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    type: { type: String, enum: ['course', 'website'], default: 'course' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
