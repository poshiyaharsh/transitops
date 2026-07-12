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

// PUT /api/drivers/:id - Update driver details
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email, license, expiry, status, rating, trips, vehicle } = req.body;
    const driver = await Driver.findOne({ id: req.params.id });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    if (name !== undefined) driver.name = name;
    if (phone !== undefined) driver.phone = phone;
    if (email !== undefined) driver.email = email;
    if (license !== undefined) driver.license = license;
    if (expiry !== undefined) driver.expiry = expiry;
    if (status !== undefined) driver.status = status;
    if (rating !== undefined) driver.rating = Number(rating);
    if (trips !== undefined) driver.trips = Number(trips);
    if (vehicle !== undefined) driver.vehicle = vehicle;

    const updatedDriver = await driver.save();
    res.json(updatedDriver);
  } catch (error) {
    console.error('Error updating driver:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// DELETE /api/drivers/:id - Delete a driver
router.delete('/:id', async (req, res) => {
  try {
    const result = await Driver.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
