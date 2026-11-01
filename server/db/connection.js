import mongoose from 'mongoose';

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error('MONGO_URI is not set. Check server/.env');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log(`MongoDB connected successfully to database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

export default connectDB;