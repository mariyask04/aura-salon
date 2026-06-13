import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const router = express.Router();

// Seed default admin on first call if no users exist
const seedAdmin = async () => {
    const count = await User.countDocuments();
    if (count === 0) {
        await User.create({ userId: 'admin', password: 'admin123', name: 'Admin User', role: 'admin' });
        console.log('Default admin created: admin / admin123');
    }
};
seedAdmin();

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await User.findOne({ userId });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const match = await user.comparePassword(password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, userId: user.userId, name: user.name }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, user: { userId: user.userId, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;