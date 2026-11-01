import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const login = async (req, res) => {
    try {
        const email = typeof req.body.email === 'string'
            ? req.body.email.trim().toLowerCase()
            : '';
        const { password } = req.body;

        if (!email || typeof password !== 'string') {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        
        const user = await User.findOne({email});
        if (!user) {
            console.warn('[auth/login] User not found');
            return res.status(401).json({success:false, message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn('[auth/login] Invalid credentials');
            return res.status(401).json({success:false, message: "Invalid credentials"});
        }
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '2d'});

        console.info('[auth/login] Login successful');
        return res.status(200).json({ success: true, message: "login successful", token, user: {id: user._id, name: user.name, email: user.email, role: user.role }});
    } catch (error) {
        console.error('Login failed:', error.message);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

export {login};