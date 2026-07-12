require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/settings', require('./src/routes/settings'));
app.use('/api/drivers', require('./src/routes/drivers'));
app.use('/api/vehicles', require('./src/routes/vehicles'));
app.use('/api/trips', require('./src/routes/trips'));
app.use('/api/maintenance', require('./src/routes/maintenance'));
app.use('/api/fuelExpenses', require('./src/routes/fuelExpenses'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Backend is running correctly.' });
});

// Seed functions
const Driver = require('./src/models/Driver');
const Vehicle = require('./src/models/Vehicle');
const Trip = require('./src/models/Trip');
const Maintenance = require('./src/models/Maintenance');
const FuelExpense = require('./src/models/FuelExpense');

async function seedDrivers() {
  try {
    const count = await Driver.countDocuments();
    if (count === 0) {
      const defaultDrivers = [
        { id: 'DRV-001', name: 'Emeka Obi', phone: '+234 801 234 5678', email: 'emeka@transitops.io', license: 'FG-8821-NG', expiry: '2025-04-15', status: 'Available', rating: 4.9, trips: 312, vehicle: 'TRK-101' },
        { id: 'DRV-002', name: 'Fatima Bello', phone: '+234 802 345 6789', email: 'fatima@transitops.io', license: 'FG-7744-NG', expiry: '2026-09-30', status: 'On Trip', rating: 4.7, trips: 248, vehicle: 'TRK-102' },
        { id: 'DRV-003', name: 'Uche Eze', phone: '+234 803 456 7890', email: 'uche@transitops.io', license: 'FG-5512-NG', expiry: '2026-01-10', status: 'Available', rating: 4.8, trips: 189, vehicle: 'VAN-201' },
        { id: 'DRV-004', name: 'Tunde Adeyemi', phone: '+234 804 567 8901', email: 'tunde@transitops.io', license: 'FG-3301-NG', expiry: '2025-11-22', status: 'On Trip', rating: 4.5, trips: 421, vehicle: 'VAN-202' },
        { id: 'DRV-005', name: 'Chioma Nwosu', phone: '+234 805 678 9012', email: 'chioma@transitops.io', license: 'FG-9981-NG', expiry: '2027-03-18', status: 'Available', rating: 4.9, trips: 156, vehicle: 'TRK-105' },
        { id: 'DRV-006', name: 'Bayo Ogundimu', phone: '+234 806 789 0123', email: 'bayo@transitops.io', license: 'FG-1155-NG', expiry: '2024-12-01', status: 'Inactive', rating: 3.8, trips: 88, vehicle: '—' },
      ];
      await Driver.insertMany(defaultDrivers);
      console.log('Database seeded with default drivers.');
    }
  } catch (err) {
    console.error('Error seeding drivers:', err);
  }
}

async function seedVehicles() {
  try {
    const count = await Vehicle.countDocuments();
    if (count === 0) {
      const defaultVehicles = [
        { id: 'TRK-101', make: 'Mercedes Benz Actros', year: 2022, type: 'Heavy Truck', driver: 'Emeka Obi', status: 'Available', mileage: '48,200 km', fuel: '62%' },
        { id: 'TRK-102', make: 'MAN TGS 26.440', year: 2021, type: 'Heavy Truck', driver: 'Fatima Bello', status: 'On Trip', mileage: '71,450 km', fuel: '38%' },
        { id: 'TRK-103', make: 'Isuzu FTR 850', year: 2023, type: 'Medium Truck', driver: '—', status: 'Maintenance', mileage: '22,800 km', fuel: '80%' },
        { id: 'VAN-201', make: 'Toyota HiAce', year: 2022, type: 'Minivan', driver: 'Uche Eze', status: 'Available', mileage: '31,600 km', fuel: '55%' },
        { id: 'VAN-202', make: 'Ford Transit Custom', year: 2020, type: 'Minivan', driver: 'Tunde Adeyemi', status: 'On Trip', mileage: '95,300 km', fuel: '24%' },
        { id: 'TRK-104', make: 'DAF XF 480', year: 2021, type: 'Heavy Truck', driver: '—', status: 'Available', mileage: '61,100 km', fuel: '90%' },
        { id: 'TRK-105', make: 'Scania R500', year: 2019, type: 'Heavy Truck', driver: 'Chioma Nwosu', status: 'On Trip', mileage: '110,200 km', fuel: '41%' },
        { id: 'TRK-106', make: 'Volvo FH16', year: 2018, type: 'Heavy Truck', driver: '—', status: 'Retired', mileage: '215,400 km', fuel: '0%' },
      ];
      await Vehicle.insertMany(defaultVehicles);
      console.log('Database seeded with default vehicles.');
    }
  } catch (err) {
    console.error('Error seeding vehicles:', err);
  }
}

async function seedTrips() {
  try {
    const count = await Trip.countDocuments();
    if (count === 0) {
      const defaultTrips = [
        { id: 'TRP-8821', from: 'Lagos HQ', to: 'Abuja Terminal', driver: 'Emeka Obi', vehicle: 'TRK-101', status: 'Completed', departure: '06:00', arrival: '08:14', date: '2026-07-12', distance: '762 km' },
        { id: 'TRP-8820', from: 'Port Harcourt', to: 'Warri Depot', driver: 'Fatima Bello', vehicle: 'TRK-102', status: 'On Trip', departure: '09:30', arrival: '—', date: '2026-07-12', distance: '196 km' },
        { id: 'TRP-8819', from: 'Kano Hub', to: 'Kaduna Yard', driver: 'Uche Eze', vehicle: 'VAN-201', status: 'Completed', departure: '07:15', arrival: '10:17', date: '2026-07-12', distance: '185 km' },
        { id: 'TRP-8818', from: 'Ibadan Depot', to: 'Lagos HQ', driver: 'Tunde Adeyemi', vehicle: 'VAN-202', status: 'Cancelled', departure: '11:00', arrival: '—', date: '2026-07-12', distance: '128 km' },
        { id: 'TRP-8817', from: 'Abuja Terminal', to: 'Jos Depot', driver: 'Chioma Nwosu', vehicle: 'TRK-105', status: 'Scheduled', departure: '08:00', arrival: '—', date: '2026-07-13', distance: '340 km' },
        { id: 'TRP-8816', from: 'Lagos HQ', to: 'Benin City', driver: 'Emeka Obi', vehicle: 'TRK-101', status: 'Completed', departure: '05:30', arrival: '08:45', date: '2026-07-11', distance: '335 km' },
      ];
      await Trip.insertMany(defaultTrips);
      console.log('Database seeded with default trips.');
    }
  } catch (err) {
    console.error('Error seeding trips:', err);
  }
}

async function seedMaintenance() {
  try {
    const count = await Maintenance.countDocuments();
    if (count === 0) {
      const defaultMaintenance = [
        { id: 'MNT-441', vehicle: 'TRK-103', type: 'Engine Overhaul', tech: 'Ade Mechanics Ltd', date: '2026-07-10', cost: 480000, status: 'Maintenance', note: 'Cylinder head gasket replaced' },
        { id: 'MNT-440', vehicle: 'TRK-101', type: 'Oil & Filter Change', tech: 'In-house', date: '2026-07-08', cost: 12500, status: 'Completed', note: 'Next due at 50,000 km' },
        { id: 'MNT-439', vehicle: 'VAN-202', type: 'Brake Pad Replacement', tech: 'BrakePro Workshop', date: '2026-07-05', cost: 38000, status: 'Completed', note: 'Front and rear done' },
        { id: 'MNT-438', vehicle: 'TRK-102', type: 'Tire Rotation', tech: 'In-house', date: '2026-07-01', cost: 5000, status: 'Completed', note: '' },
        { id: 'MNT-437', vehicle: 'TRK-106', type: 'Full Inspection', tech: 'TransitCare Ltd', date: '2026-06-28', cost: 75000, status: 'Completed', note: 'Vehicle flagged for retirement' },
      ];
      await Maintenance.insertMany(defaultMaintenance);
      console.log('Database seeded with default maintenance records.');
    }
  } catch (err) {
    console.error('Error seeding maintenance:', err);
  }
}

async function seedFuelExpenses() {
  try {
    const count = await FuelExpense.countDocuments();
    if (count === 0) {
      const defaultFuel = [
        { id: 'FL-1001', date: '2026-07-12', vehicle: 'TRK-101', litres: 280, rate: 125, total: 35000, station: 'NNPC Lagos' },
        { id: 'FL-1002', date: '2026-07-12', vehicle: 'TRK-102', litres: 320, rate: 125, total: 40000, station: 'Total PH' },
        { id: 'FL-1003', date: '2026-07-11', vehicle: 'VAN-201', litres: 80, rate: 125, total: 10000, station: 'Ardova Kano' },
        { id: 'FL-1004', date: '2026-07-11', vehicle: 'TRK-104', litres: 240, rate: 125, total: 30000, station: 'NNPC Abuja' },
      ];
      await FuelExpense.insertMany(defaultFuel);
      console.log('Database seeded with default fuel expenses.');
    }
  } catch (err) {
    console.error('Error seeding fuel expenses:', err);
  }
}

// Start Server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await seedDrivers();
    await seedVehicles();
    await seedTrips();
    await seedMaintenance();
    await seedFuelExpenses();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

