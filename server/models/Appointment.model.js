import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    staffName: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    timeSlot: { type: String, required: true }, // e.g. "10:00 AM"
    service: { type: String, required: true },
    servicePrice: { type: Number, required: true },
    notes: { type: String },
    status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' },
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);