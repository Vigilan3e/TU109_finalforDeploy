import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './db/connection.js';
import authRoutes from './routes/auth.js';
import categoryRoute from './routes/category.js';
import supplierRoutes from './routes/supplier.js';
import productRoutes from './routes/product.js';
import dashboardRouter from './routes/dashboard.js'



const app = express();
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://tu-109-finalfor-deploy.vercel.app',
        'https://pigvillain.com',
        'https://www.pigvillain.com'
    ],
    credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoute);
app.use('/api/supplier', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRouter);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect DB / start server:', error);
    }
};

startServer();