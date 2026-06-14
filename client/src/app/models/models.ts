export interface User {
  userId: string;
  name: string;
  role: string;
}

export interface Staff {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  specialization?: string;
  isActive: boolean;
}

export interface Client {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface Appointment {
  _id: string;
  clientName: string;
  clientPhone: string;
  staffId: string;
  staffName: string;
  date: string;
  timeSlot: string;
  service: string;
  servicePrice: number;
  notes?: string;
  status: 'booked' | 'completed' | 'cancelled';
  createdAt?: string;
}

export interface Bill {
  _id?: string;
  appointmentId: string;
  clientName: string;
  staffName: string;
  service: string;
  date: string;
  timeSlot: string;
  serviceAmount: number;
  taxPercent: number;
  discountAmount: number;
  totalAmount: number;
  createdAt?: string;
}

export const SERVICES = [
  { name: 'Haircut', price: 300 },
  { name: 'Hair Color', price: 800 },
  { name: 'Blow Dry', price: 250 },
  { name: 'Hair Spa', price: 600 },
  { name: 'Facial', price: 700 },
  { name: 'Cleanup', price: 400 },
  { name: 'Waxing', price: 350 },
  { name: 'Threading', price: 100 },
  { name: 'Manicure', price: 450 },
  { name: 'Pedicure', price: 500 },
  { name: 'Nail Art', price: 600 },
  { name: 'Bridal Makeup', price: 5000 },
];

export const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
  '7:00 PM', '7:30 PM',
];