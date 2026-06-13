import express from 'express';
import Appointment from '../models/Appointment.model.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// GET all appointments (optionally filter by date)
router.get('/', auth, async (req, res) => {
    try {
        const filter = {};
        if (req.query.date) filter.date = req.query.date;
        if (req.query.staffId) filter.staffId = req.query.staffId;
        const appointments = await Appointment.find(filter).sort({ date: 1, timeSlot: 1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single appointment
router.get('/:id', auth, async (req, res) => {
    try {
        const appt = await Appointment.findById(req.params.id);
        if (!appt) return res.status(404).json({ message: 'Not found' });
        res.json(appt);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create appointment
router.post('/', auth, async (req, res) => {
    try {
        const appt = await Appointment.create(req.body);
        res.status(201).json(appt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update appointment
router.put('/:id', auth, async (req, res) => {
    try {
        const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!appt) return res.status(404).json({ message: 'Not found' });
        res.json(appt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE cancel appointment
router.delete('/:id', auth, async (req, res) => {
    try {
        await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
        res.json({ message: 'Appointment cancelled' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;