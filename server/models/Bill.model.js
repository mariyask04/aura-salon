import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    clientName: { type: String, required: true },
    staffName: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    serviceAmount: { type: Number, required: true },
    taxPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Bill', billSchema);