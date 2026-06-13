import express from 'express';
import Bill from '../models/Bill.model.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const bills = await Bill.find().sort({ createdAt: -1 });
        res.json(bills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/appointment/:appointmentId', auth, async (req, res) => {
    try {
        const bill = await Bill.findOne({ appointmentId: req.params.appointmentId });
        if (!bill) return res.status(404).json({ message: 'No bill found' });
        res.json(bill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { serviceAmount, taxPercent = 0, discountAmount = 0 } = req.body;
        const tax = (serviceAmount * taxPercent) / 100;
        const totalAmount = serviceAmount + tax - discountAmount;
        const bill = await Bill.create({ ...req.body, totalAmount });
        res.status(201).json(bill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;