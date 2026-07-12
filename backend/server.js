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
    await Driver.deleteMany({});
      const defaultDrivers = [
        { id: 'DRV-001', name: 'Amit Sharma', phone: '+91 98765 43210', email: 'amit.sharma@transitops.in', license: 'MH-01-20230123', expiry: '2026-10-15', status: 'Available', rating: 4.9, trips: 312, vehicle: 'TRK-101' },
        { id: 'DRV-002', name: 'Priya Patel', phone: '+91 87654 32109', email: 'priya.patel@transitops.in', license: 'GJ-05-20220543', expiry: '2026-08-30', status: 'On Trip', rating: 4.7, trips: 248, vehicle: 'TRK-102' },
        { id: 'DRV-003', name: 'Rajesh Kumar', phone: '+91 76543 21098', email: 'rajesh.kumar@transitops.in', license: 'DL-04-20210765', expiry: '2026-07-20', status: 'Available', rating: 4.8, trips: 189, vehicle: 'VAN-201' },
        { id: 'DRV-004', name: 'Sneha Gupta', phone: '+91 65432 10987', email: 'sneha.gupta@transitops.in', license: 'KA-03-20230987', expiry: '2026-11-22', status: 'On Trip', rating: 4.5, trips: 421, vehicle: 'VAN-202' },
        { id: 'DRV-005', name: 'Vikram Singh', phone: '+91 54321 09876', email: 'vikram.singh@transitops.in', license: 'UP-32-20240123', expiry: '2027-03-18', status: 'Available', rating: 4.9, trips: 156, vehicle: 'TRK-103' }
      ];
    await Driver.insertMany(defaultDrivers);
    console.log('Database cleared and seeded with rich drivers.');
  } catch (err) {
    console.error('Error seeding drivers:', err);
  }
}

async function seedVehicles() {
  try {
    await Vehicle.deleteMany({});
      const defaultVehicles = [
        { id: 'TRK-101', make: 'Tata Prima', year: 2022, type: 'Heavy Truck', driver: 'Amit Sharma', status: 'Available', mileage: '48,200 km', fuel: '62%' },
        { id: 'TRK-102', make: 'Ashok Leyland Bada Dost', year: 2021, type: 'Heavy Truck', driver: 'Priya Patel', status: 'On Trip', mileage: '71,450 km', fuel: '38%' },
        { id: 'TRK-103', make: 'Mahindra Blazo', year: 2023, type: 'Medium Truck', driver: 'Vikram Singh', status: 'Maintenance', mileage: '122,800 km', fuel: '18%' },
        { id: 'VAN-201', make: 'Tata Winger', year: 2022, type: 'Minivan', driver: 'Rajesh Kumar', status: 'Available', mileage: '31,600 km', fuel: '55%' },
        { id: 'VAN-202', make: 'Force Traveller', year: 2020, type: 'Minivan', driver: 'Sneha Gupta', status: 'On Trip', mileage: '105,300 km', fuel: '14%' }
      ];
    await Vehicle.insertMany(defaultVehicles);
    console.log('Database cleared and seeded with rich vehicles.');
  } catch (err) {
    console.error('Error seeding vehicles:', err);
  }
}

async function seedTrips() {
  try {
    await Trip.deleteMany({});
      const defaultTrips = [
        { id: 'TRP-8821', from: 'Mumbai HQ', to: 'Delhi Terminal', driver: 'Amit Sharma', vehicle: 'TRK-101', status: 'Completed', departure: '06:00', arrival: '14:24', date: '2026-07-12', distance: '1400 km' },
        { id: 'TRP-8820', from: 'Ahmedabad Depot', to: 'Pune Yard', driver: 'Priya Patel', vehicle: 'TRK-102', status: 'On Trip', departure: '09:30', arrival: '—', date: '2026-07-12', distance: '660 km' },
        { id: 'TRP-8819', from: 'Bangalore Hub', to: 'Chennai Yard', driver: 'Rajesh Kumar', vehicle: 'VAN-201', status: 'Completed', departure: '07:15', arrival: '10:17', date: '2026-07-12', distance: '350 km' },
        { id: 'TRP-8818', from: 'Delhi Terminal', to: 'Jaipur Depot', driver: 'Sneha Gupta', vehicle: 'VAN-202', status: 'Cancelled', departure: '11:00', arrival: '—', date: '2026-07-12', distance: '280 km' },
        { id: 'TRP-8817', from: 'Mumbai HQ', to: 'Pune Yard', driver: 'Vikram Singh', vehicle: 'TRK-103', status: 'Scheduled', departure: '08:00', arrival: '—', date: '2026-07-13', distance: '150 km' }
      ];
    await Trip.insertMany(defaultTrips);
    console.log('Database cleared and seeded with rich trips.');
  } catch (err) {
    console.error('Error seeding trips:', err);
  }
}

async function seedMaintenance() {
  try {
    await Maintenance.deleteMany({});
      const defaultMaintenance = [
        { id: 'MNT-441', vehicle: 'TRK-103', type: 'Engine Overhaul', tech: 'Sharma Auto Works', date: '2026-07-10', cost: 45000, status: 'Maintenance', note: 'Cylinder head gasket replaced' },
        { id: 'MNT-440', vehicle: 'TRK-101', type: 'Oil & Filter Change', tech: 'In-house Workshop', date: '2026-07-08', cost: 4500, status: 'Completed', note: 'Used Castrol CRB' },
        { id: 'MNT-439', vehicle: 'VAN-202', type: 'Brake Pad Replacement', tech: 'Patel Garage', date: '2026-07-05', cost: 6800, status: 'Completed', note: 'Front and rear pads replaced' },
        { id: 'MNT-438', vehicle: 'TRK-102', type: 'Tire Rotation & Balancing', tech: 'In-house Workshop', date: '2026-07-01', cost: 2500, status: 'Completed', note: 'Rear tires rotated to front' }
      ];
    await Maintenance.insertMany(defaultMaintenance);
    console.log('Database cleared and seeded with rich maintenance records.');
  } catch (err) {
    console.error('Error seeding maintenance:', err);
  }
}

async function seedFuelExpenses() {
  try {
    await FuelExpense.deleteMany({});
      const defaultFuel = [
        { id: 'FL-1001', date: '2026-07-12', vehicle: 'TRK-101', litres: 280, rate: 96, total: 26880, station: 'Indian Oil Mumbai' },
        { id: 'FL-1002', date: '2026-07-12', vehicle: 'TRK-102', litres: 320, rate: 95, total: 30400, station: 'Bharat Petroleum Ahmedabad' },
        { id: 'FL-1003', date: '2026-07-11', vehicle: 'VAN-201', litres: 80, rate: 101, total: 8080, station: 'Reliance Bangalore' },
        { id: 'FL-1004', date: '2026-07-11', vehicle: 'TRK-103', litres: 240, rate: 94, total: 22560, station: 'HPCL Pune' },
        { id: 'FL-1005', date: '2026-07-09', vehicle: 'VAN-202', litres: 95, rate: 96, total: 9120, station: 'Indian Oil Delhi' }
      ];
    await FuelExpense.insertMany(defaultFuel);
    console.log('Database cleared and seeded with rich fuel expenses.');
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

