const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  license: {
    type: String,
    required: true
  },
  expiry: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'On Trip', 'Inactive'],
    default: 'Available'
  },
  rating: {
    type: Number,
    default: 5.0
  },
  trips: {
    type: Number,
    default: 0
  },
  vehicle: {
    type: String,
    default: '—'
  }
}, { timestamps: true });

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;
