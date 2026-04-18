const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    tutor: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['Ongoing', 'Scheduled', 'Completed'], default: 'Scheduled' },
    image: { type: String, required: true },
    description: { type: String },
    tutorImage: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
