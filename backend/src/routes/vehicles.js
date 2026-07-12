const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// GET /api/vehicles - Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ id: 1 });
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// POST /api/vehicles - Add a new vehicle
router.post('/', async (req, res) => {
  try {
    const { make, year, type, driver, status, mileage, fuel } = req.body;

    if (!make || !year || !type) {
      return res.status(400).json({ message: 'Please provide all required fields: make, year, type' });
    }

    // Determine the next vehicle ID (e.g. TRK-106 or VAN-203 depending on type)
    // For simplicity, let's find the max ID number across all vehicles and increment
    const vehicles = await Vehicle.find({});
    let maxIdNum = 100; // start at 100
    vehicles.forEach(v => {
      const match = v.id.match(/(?:TRK|VAN)-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxIdNum) {
          maxIdNum = num;
        }
      }
    });

    const nextNum = maxIdNum + 1;
    const prefix = type.toLowerCase().includes('van') ? 'VAN' : 'TRK';
    const nextId = `${prefix}-${nextNum}`;

    const newVehicle = new Vehicle({
      id: nextId,
      make,
      year: Number(year),
      type,
      driver: driver || '—',
      status: status || 'Available',
      mileage: mileage || '0 km',
      fuel: fuel || '100%'
    });

    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
