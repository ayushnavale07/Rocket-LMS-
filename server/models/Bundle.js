const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    instructor: { type: String, default: 'Admin' },
    image: { type: String },
    rating: { type: Number, default: 5 },
    reviewsCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bundle', bundleSchema);
