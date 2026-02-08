const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    duration: { type: String },
    studentsCount: { type: Number, default: 0 },
    type: { type: String, enum: ['Course', 'Live Class', 'Text Lesson'], default: 'Course' },
    description: { type: String }
});

module.exports = mongoose.model('Course', courseSchema);
