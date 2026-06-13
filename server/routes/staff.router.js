import express from 'express';
import Staff from '../models/Staff.model.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const staff = await Staff.find({ isActive: true });
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const staff = await Staff.create(req.body);
        res.status(201).json(staff);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(staff);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Staff.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ message: 'Staff removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Seed default staff
const seedStaff = async () => {
    const count = await Staff.countDocuments();
    if (count === 0) {
        await Staff.insertMany([
            { name: 'Priya Sharma', phone: '9876543210', specialization: 'Hair Stylist' },
            { name: 'Anjali Mehta', phone: '9876543211', specialization: 'Nail Artist' },
            { name: 'Ravi Kumar', phone: '9876543212', specialization: 'Skin Care' },
        ]);
        console.log('Default staff seeded');
    }
};
seedStaff();

export default router;