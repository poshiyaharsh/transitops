const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// GET /api/trips - Get all trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find().sort({ date: -1, departure: -1 });
    res.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// POST /api/trips - Create/dispatch a new trip
router.post('/', async (req, res) => {
  try {
    const { from, to, date, vehicle, driver, departure, status } = req.body;

    if (!from || !to || !date || !vehicle || !driver || !departure) {
      return res.status(400).json({ message: 'Please provide all required fields: from, to, date, vehicle, driver, departure' });
    }

    // Determine the next trip ID (e.g., TRP-8822)
    const trips = await Trip.find({});
    let maxIdNum = 8800; // default start basis
    trips.forEach(t => {
      if (t.id && t.id.startsWith('TRP-')) {
        const num = parseInt(t.id.substring(4), 10);
        if (!isNaN(num) && num > maxIdNum) {
          maxIdNum = num;
        }
      }
    });

    const nextNum = maxIdNum + 1;
    const nextId = `TRP-${nextNum}`;

    // Mock a distance if not provided
    const distanceVal = `${Math.floor(Math.random() * 600) + 120} km`;

    const newTrip = new Trip({
      id: nextId,
      from,
      to,
      date,
      vehicle,
      driver,
      departure,
      status: status || 'Scheduled',
      arrival: '—',
      distance: distanceVal
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// PUT /api/trips/:id - Update trip details or status
router.put('/:id', async (req, res) => {
  try {
    const { status, arrival, distance } = req.body;
    const trip = await Trip.findOne({ id: req.params.id });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (status) trip.status = status;
    if (arrival) trip.arrival = arrival;
    if (distance) trip.distance = distance;

    // Automatically set arrival time if status changes to Completed and no arrival is set
    if (status === 'Completed' && (!arrival || arrival === '—')) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      trip.arrival = `${hours}:${minutes}`;
    }

    const updatedTrip = await trip.save();
    res.json(updatedTrip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// DELETE /api/trips/:id - Delete a trip
router.delete('/:id', async (req, res) => {
  try {
    const result = await Trip.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
