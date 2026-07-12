const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

// GET /api/maintenance - Get all logs
router.get('/', async (req, res) => {
  try {
    const logs = await Maintenance.find().sort({ date: -1, id: -1 });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching maintenance logs:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// POST /api/maintenance - Log a new service
router.post('/', async (req, res) => {
  try {
    const { vehicle, type, tech, date, cost, status, note } = req.body;

    if (!vehicle || !type || !tech || !date || !cost) {
      return res.status(400).json({ message: 'Please provide all required fields: vehicle, type, tech, date, cost' });
    }

    // Determine the next maintenance ID (e.g. MNT-442)
    const logs = await Maintenance.find({});
    let maxIdNum = 430; // default start basis
    logs.forEach(l => {
      if (l.id && l.id.startsWith('MNT-')) {
        const num = parseInt(l.id.substring(4), 10);
        if (!isNaN(num) && num > maxIdNum) {
          maxIdNum = num;
        }
      }
    });

    const nextNum = maxIdNum + 1;
    const nextId = `MNT-${nextNum}`;

    const newLog = new Maintenance({
      id: nextId,
      vehicle,
      type,
      tech,
      date,
      cost: Number(cost),
      status: status || 'Maintenance',
      note: note || ''
    });

    const savedLog = await newLog.save();

    // If status is 'Maintenance', update vehicle status to 'Maintenance'
    if (newLog.status === 'Maintenance') {
      await Vehicle.updateOne({ id: vehicle }, { status: 'Maintenance' });
    }

    res.status(201).json(savedLog);
  } catch (error) {
    console.error('Error logging maintenance:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// PUT /api/maintenance/:id - Update maintenance log or complete it
router.put('/:id', async (req, res) => {
  try {
    const { type, tech, date, cost, status, note, vehicle } = req.body;
    const log = await Maintenance.findOne({ id: req.params.id });

    if (!log) {
      return res.status(404).json({ message: 'Maintenance log not found' });
    }

    const oldStatus = log.status;
    const oldVehicle = log.vehicle;

    if (vehicle !== undefined) log.vehicle = vehicle;
    if (type !== undefined) log.type = type;
    if (tech !== undefined) log.tech = tech;
    if (date !== undefined) log.date = date;
    if (cost !== undefined) log.cost = Number(cost);
    if (status !== undefined) log.status = status;
    if (note !== undefined) log.note = note;

    const updatedLog = await log.save();

    // If status changed to 'Completed' (and was 'Maintenance'), set vehicle status to 'Available'
    if (oldStatus === 'Maintenance' && status === 'Completed') {
      await Vehicle.updateOne({ id: log.vehicle }, { status: 'Available' });
    } else if (status === 'Maintenance' && oldStatus === 'Completed') {
      // If reopened as 'Maintenance', set vehicle status to 'Maintenance'
      await Vehicle.updateOne({ id: log.vehicle }, { status: 'Maintenance' });
    }

    // Handle vehicle change side-effects
    if (vehicle !== undefined && oldVehicle !== vehicle) {
      // If the log was active Maintenance, toggle status on old vs new vehicles
      if (log.status === 'Maintenance') {
        await Vehicle.updateOne({ id: oldVehicle }, { status: 'Available' });
        await Vehicle.updateOne({ id: vehicle }, { status: 'Maintenance' });
      }
    }

    res.json(updatedLog);
  } catch (error) {
    console.error('Error updating maintenance:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// DELETE /api/maintenance/:id - Delete a log
router.delete('/:id', async (req, res) => {
  try {
    const log = await Maintenance.findOne({ id: req.params.id });
    if (!log) {
      return res.status(404).json({ message: 'Maintenance log not found' });
    }

    const vehicleId = log.vehicle;
    const status = log.status;

    await Maintenance.deleteOne({ id: req.params.id });

    // If deleted log was active 'Maintenance', reset vehicle status to 'Available'
    if (status === 'Maintenance') {
      await Vehicle.updateOne({ id: vehicleId }, { status: 'Available' });
    }

    res.json({ message: 'Maintenance log deleted successfully' });
  } catch (error) {
    console.error('Error deleting maintenance:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
