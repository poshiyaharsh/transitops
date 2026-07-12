const express = require('express');
const router = express.Router();
const FuelExpense = require('../models/FuelExpense');
const Vehicle = require('../models/Vehicle');

// GET /api/fuelExpenses - Get all fuel logs
router.get('/', async (req, res) => {
  try {
    const logs = await FuelExpense.find().sort({ date: -1, id: -1 });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching fuel logs:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// POST /api/fuelExpenses - Log a new fuel purchase
router.post('/', async (req, res) => {
  try {
    const { date, vehicle, litres, rate, station, mileage, fuel } = req.body;

    if (!date || !vehicle || !litres || !rate || !station) {
      return res.status(400).json({ message: 'Please provide all required fields: date, vehicle, litres, rate, station' });
    }

    // Determine the next fuel expense ID (e.g. FL-1001)
    const logs = await FuelExpense.find({});
    let maxIdNum = 1000;
    logs.forEach(l => {
      if (l.id && l.id.startsWith('FL-')) {
        const num = parseInt(l.id.substring(3), 10);
        if (!isNaN(num) && num > maxIdNum) {
          maxIdNum = num;
        }
      }
    });

    const nextId = `FL-${maxIdNum + 1}`;
    const totalCost = Number(litres) * Number(rate);

    const newLog = new FuelExpense({
      id: nextId,
      date,
      vehicle,
      litres: Number(litres),
      rate: Number(rate),
      total: totalCost,
      station
    });

    const savedLog = await newLog.save();

    // Side-effects: update vehicle mileage and fuel if provided
    const vehicleUpdate = {};
    if (mileage) {
      // Ensure it has ' km' suffix or clean it
      let cleanMileage = String(mileage).trim();
      if (!cleanMileage.toLowerCase().includes('km')) {
        cleanMileage = `${cleanMileage} km`;
      }
      vehicleUpdate.mileage = cleanMileage;
    }
    if (fuel) {
      // Ensure it has '%' suffix
      let cleanFuel = String(fuel).trim();
      if (!cleanFuel.includes('%')) {
        cleanFuel = `${cleanFuel}%`;
      }
      vehicleUpdate.fuel = cleanFuel;
    }

    if (Object.keys(vehicleUpdate).length > 0) {
      await Vehicle.updateOne({ id: vehicle }, vehicleUpdate);
    }

    res.status(201).json(savedLog);
  } catch (error) {
    console.error('Error logging fuel purchase:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// DELETE /api/fuelExpenses/:id - Delete a fuel log
router.delete('/:id', async (req, res) => {
  try {
    const result = await FuelExpense.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Fuel expense log not found' });
    }
    res.json({ message: 'Fuel expense log deleted successfully' });
  } catch (error) {
    console.error('Error deleting fuel expense:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
