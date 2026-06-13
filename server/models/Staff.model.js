import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    specialization: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Staff', staffSchema);