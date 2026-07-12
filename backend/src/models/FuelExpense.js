const mongoose = require('mongoose');

const fuelExpenseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  vehicle: {
    type: String,
    required: true
  },
  litres: {
    type: Number,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  station: {
    type: String,
    required: true
  }
}, { timestamps: true });

const FuelExpense = mongoose.model('FuelExpense', fuelExpenseSchema);
module.exports = FuelExpense;
