const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'student' }
});

const User = mongoose.model('User', UserSchema);

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB Atlas...");

        // Delete existing admin to ensure fresh credentials
        await User.deleteOne({ email: 'admin@rocketlms.org' });

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            name: 'Admin',
            email: 'admin@rocketlms.org',
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log("✅ Admin account created/reset: admin@rocketlms.org / admin123");
        process.exit();
    } catch (err) {
        console.error("❌ Error seeding:", err.message);
        process.exit(1);
    }
}

seed();
