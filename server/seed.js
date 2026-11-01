import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from './models/User.js';
import connectDB from './db/connection.js';

const seedAdmin = async () => {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD before running the seed script');
    }

    await connectDB();

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
        console.log(`Admin user already exists: ${email}`);
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        name: 'admin',
        email,
        password: hashedPassword,
        address: 'admin address',
        role: 'admin'
    });

    console.log(`Admin user created: ${email}`);
};

seedAdmin()
    .catch((error) => {
        console.error('Admin seed failed:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });

