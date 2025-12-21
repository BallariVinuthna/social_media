const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialconnect';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding');

        const demoEmail = 'demo@connext.com';
        const demoPassword = 'demo123456';
        const demoUsername = 'demo';

        let user = await User.findOne({ email: demoEmail });
        if (user) {
            console.log('Demo user already exists:', demoEmail);
        } else {
            user = await User.create({
                username: demoUsername,
                email: demoEmail,
                password: demoPassword,
                fullName: 'Demo User'
            });
            console.log('Created demo user:', demoEmail);
        }

        await mongoose.disconnect();
        console.log('Disconnected after seeding');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();
