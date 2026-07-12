const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// GET /api/drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ id: 1 });
    res.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// POST /api/drivers
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, license, expiry, status, rating, trips, vehicle } = req.body;
    
    // Validate inputs
    if (!name || !phone || !email || !license || !expiry) {
      return res.status(400).json({ message: 'Please provide all required fields: name, phone, email, license, expiry' });
    }

    // Determine the next driver ID (e.g. DRV-007)
    // Find driver with highest numeric part of id
    const drivers = await Driver.find({});
    let maxIdNum = 0;
    drivers.forEach(d => {
      if (d.id && d.id.startsWith('DRV-')) {
        const num = parseInt(d.id.substring(4), 10);
        if (!isNaN(num) && num > maxIdNum) {
          maxIdNum = num;
        }
      }
    });
    
    const nextNum = maxIdNum + 1;
    const nextId = `DRV-${String(nextNum).padStart(3, '0')}`;

    const newDriver = new Driver({
      id: nextId,
      name,
      phone,
      email,
      license,
      expiry,
      status: status || 'Available',
      rating: typeof rating !== 'undefined' && rating !== '' ? Number(rating) : 5.0,
      trips: typeof trips !== 'undefined' && trips !== '' ? Number(trips) : 0,
      vehicle: vehicle || '—'
    });

    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
