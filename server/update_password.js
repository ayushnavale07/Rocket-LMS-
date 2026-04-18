const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Use your database URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://admin:RocketLMS123@ayushcluster.xq8gj.mongodb.net/rocket-lms?retryWrites=true&w=majority&appName=ayushcluster";

const User = require('./models/User');

async function updatePassword(email, newPassword) {
    try {
        // Use a more direct connection attempt
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Connected to database...");

        const user = await User.findOne({ email });
        if (!user) {
            console.error("Error: User with this email not found.");
            process.exit(1);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        console.log(`✅ Success! Password for ${email} has been updated securely.`);
        process.exit(0);
    } catch (err) {
        console.error("Update failed:", err.message);
        process.exit(1);
    }
}

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log("Usage: node update_password.js <email> <new_password>");
    process.exit(1);
}

updatePassword(args[0], args[1]);
