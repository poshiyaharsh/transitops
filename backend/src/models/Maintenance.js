const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  vehicle: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  tech: {
    type: String,
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Maintenance', 'Completed'],
    default: 'Maintenance'
  },
  note: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
module.exports = Maintenance;
