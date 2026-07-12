const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  driver: {
    type: String,
    required: true
  },
  vehicle: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'On Trip', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  departure: {
    type: String, // e.g., "06:00"
    required: true
  },
  arrival: {
    type: String, // e.g., "08:14" or "—"
    default: '—'
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  distance: {
    type: String, // e.g., "762 km"
    default: '—'
  }
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
