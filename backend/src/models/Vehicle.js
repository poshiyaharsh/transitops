const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  make: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  driver: {
    type: String,
    default: '—'
  },
  status: {
    type: String,
    enum: ['Available', 'On Trip', 'Maintenance', 'Retired'],
    default: 'Available'
  },
  mileage: {
    type: String,
    default: '0 km'
  },
  fuel: {
    type: String,
    default: '100%'
  }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
