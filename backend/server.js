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
      { id: 'DRV-001', name: 'Emeka Obi', phone: '+234 801 234 5678', email: 'emeka.obi@transitops.io', license: 'FG-8821-NG', expiry: '2026-10-15', status: 'Available', rating: 4.9, trips: 312, vehicle: 'TRK-101' },
      { id: 'DRV-002', name: 'Fatima Bello', phone: '+234 802 345 6789', email: 'fatima.bello@transitops.io', license: 'FG-7744-NG', expiry: '2026-08-30', status: 'On Trip', rating: 4.7, trips: 248, vehicle: 'TRK-102' },
      { id: 'DRV-003', name: 'Uche Eze', phone: '+234 803 456 7890', email: 'uche.eze@transitops.io', license: 'FG-5512-NG', expiry: '2026-07-20', status: 'Available', rating: 4.8, trips: 189, vehicle: 'VAN-201' },
      { id: 'DRV-004', name: 'Tunde Adeyemi', phone: '+234 804 567 8901', email: 'tunde.adeyemi@transitops.io', license: 'FG-3301-NG', expiry: '2026-11-22', status: 'On Trip', rating: 4.5, trips: 421, vehicle: 'VAN-202' },
      { id: 'DRV-005', name: 'Chioma Nwosu', phone: '+234 805 678 9012', email: 'chioma.nwosu@transitops.io', license: 'FG-9981-NG', expiry: '2027-03-18', status: 'Available', rating: 4.9, trips: 156, vehicle: 'TRK-105' },
      { id: 'DRV-006', name: 'Bayo Ogundimu', phone: '+234 806 789 0123', email: 'bayo.ogundimu@transitops.io', license: 'FG-1155-NG', expiry: '2026-07-28', status: 'Inactive', rating: 3.8, trips: 88, vehicle: '—' },
      { id: 'DRV-007', name: 'Kabiru Yusuf', phone: '+234 807 890 1234', email: 'kabiru.yusuf@transitops.io', license: 'FG-2244-NG', expiry: '2027-01-05', status: 'Available', rating: 4.6, trips: 95, vehicle: 'TRK-103' },
      { id: 'DRV-008', name: 'Ngozi Okeke', phone: '+234 808 901 2345', email: 'ngozi.okeke@transitops.io', license: 'FG-3377-NG', expiry: '2026-09-02', status: 'Available', rating: 4.8, trips: 142, vehicle: 'TRK-104' },
      { id: 'DRV-009', name: 'Abubakar Garba', phone: '+234 809 012 3456', email: 'abubakar.garba@transitops.io', license: 'FG-4499-NG', expiry: '2026-08-14', status: 'On Trip', rating: 4.4, trips: 204, vehicle: 'TRK-107' },
      { id: 'DRV-010', name: 'Olumide Bakare', phone: '+234 810 123 4567', email: 'olumide.bakare@transitops.io', license: 'FG-5588-NG', expiry: '2027-05-12', status: 'Available', rating: 4.7, trips: 118, vehicle: '—' }
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
      { id: 'TRK-101', make: 'Mercedes Benz Actros', year: 2022, type: 'Heavy Truck', driver: 'Emeka Obi', status: 'Available', mileage: '48,200 km', fuel: '62%' },
      { id: 'TRK-102', make: 'MAN TGS 26.440', year: 2021, type: 'Heavy Truck', driver: 'Fatima Bello', status: 'On Trip', mileage: '71,450 km', fuel: '38%' },
      { id: 'TRK-103', make: 'Isuzu FTR 850', year: 2023, type: 'Medium Truck', driver: 'Kabiru Yusuf', status: 'Maintenance', mileage: '122,800 km', fuel: '18%' },
      { id: 'VAN-201', make: 'Toyota HiAce', year: 2022, type: 'Minivan', driver: 'Uche Eze', status: 'Available', mileage: '31,600 km', fuel: '55%' },
      { id: 'VAN-202', make: 'Ford Transit Custom', year: 2020, type: 'Minivan', driver: 'Tunde Adeyemi', status: 'On Trip', mileage: '105,300 km', fuel: '14%' },
      { id: 'TRK-104', make: 'DAF XF 480', year: 2021, type: 'Heavy Truck', driver: 'Ngozi Okeke', status: 'Available', mileage: '61,100 km', fuel: '90%' },
      { id: 'TRK-105', make: 'Scania R500', year: 2019, type: 'Heavy Truck', driver: 'Chioma Nwosu', status: 'Available', mileage: '110,200 km', fuel: '41%' },
      { id: 'TRK-106', make: 'Volvo FH16', year: 2018, type: 'Heavy Truck', driver: '—', status: 'Retired', mileage: '215,400 km', fuel: '0%' },
      { id: 'TRK-107', make: 'Mack Anthem', year: 2022, type: 'Heavy Truck', driver: 'Abubakar Garba', status: 'On Trip', mileage: '82,700 km', fuel: '21%' },
      { id: 'TRK-108', make: 'Howo Sinotruk', year: 2020, type: 'Heavy Truck', driver: '—', status: 'Available', mileage: '94,100 km', fuel: '75%' }
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
      { id: 'TRP-8821', from: 'Lagos HQ', to: 'Abuja Terminal', driver: 'Emeka Obi', vehicle: 'TRK-101', status: 'Completed', departure: '06:00', arrival: '14:24', date: '2026-07-12', distance: '762 km' },
      { id: 'TRP-8820', from: 'Port Harcourt', to: 'Warri Depot', driver: 'Fatima Bello', vehicle: 'TRK-102', status: 'On Trip', departure: '09:30', arrival: '—', date: '2026-07-12', distance: '196 km' },
      { id: 'TRP-8819', from: 'Kano Hub', to: 'Kaduna Yard', driver: 'Uche Eze', vehicle: 'VAN-201', status: 'Completed', departure: '07:15', arrival: '10:17', date: '2026-07-12', distance: '185 km' },
      { id: 'TRP-8818', from: 'Ibadan Depot', to: 'Lagos HQ', driver: 'Tunde Adeyemi', vehicle: 'VAN-202', status: 'Cancelled', departure: '11:00', arrival: '—', date: '2026-07-12', distance: '128 km' },
      { id: 'TRP-8817', from: 'Abuja Terminal', to: 'Jos Depot', driver: 'Chioma Nwosu', vehicle: 'TRK-105', status: 'Scheduled', departure: '08:00', arrival: '—', date: '2026-07-13', distance: '340 km' },
      { id: 'TRP-8816', from: 'Lagos HQ', to: 'Benin City', driver: 'Emeka Obi', vehicle: 'TRK-101', status: 'Completed', departure: '05:30', arrival: '08:45', date: '2026-07-11', distance: '335 km' },
      { id: 'TRP-8815', from: 'Abuja Terminal', to: 'Kano Hub', driver: 'Abubakar Garba', vehicle: 'TRK-107', status: 'Completed', departure: '08:00', arrival: '14:30', date: '2026-07-10', distance: '430 km' },
      { id: 'TRP-8814', from: 'Lagos HQ', to: 'Ibadan Depot', driver: 'Tunde Adeyemi', vehicle: 'VAN-202', status: 'Completed', departure: '06:00', arrival: '08:15', date: '2026-07-09', distance: '128 km' },
      { id: 'TRP-8813', from: 'Enugu Depot', to: 'Port Harcourt', driver: 'Fatima Bello', vehicle: 'TRK-102', status: 'Completed', departure: '10:00', arrival: '13:50', date: '2026-07-09', distance: '220 km' },
      { id: 'TRP-8812', from: 'Kano Hub', to: 'Kaduna Yard', driver: 'Uche Eze', vehicle: 'VAN-201', status: 'Completed', departure: '09:00', arrival: '11:45', date: '2026-07-08', distance: '185 km' },
      { id: 'TRP-8811', from: 'Lagos HQ', to: 'Abuja Terminal', driver: 'Ngozi Okeke', vehicle: 'TRK-104', status: 'Completed', departure: '05:00', arrival: '13:40', date: '2026-07-08', distance: '762 km' },
      { id: 'TRP-8810', from: 'Benin City', to: 'Lagos HQ', driver: 'Emeka Obi', vehicle: 'TRK-101', status: 'Completed', departure: '13:00', arrival: '17:15', date: '2026-07-07', distance: '335 km' },
      { id: 'TRP-8809', from: 'Jos Depot', to: 'Abuja Terminal', driver: 'Chioma Nwosu', vehicle: 'TRK-105', status: 'Completed', departure: '08:30', arrival: '12:00', date: '2026-07-07', distance: '340 km' },
      { id: 'TRP-8808', from: 'Kano Hub', to: 'Abuja Terminal', driver: 'Abubakar Garba', vehicle: 'TRK-107', status: 'Completed', departure: '07:00', arrival: '13:10', date: '2026-07-06', distance: '430 km' },
      { id: 'TRP-8807', from: 'Lagos HQ', to: 'Enugu Depot', driver: 'Ngozi Okeke', vehicle: 'TRK-104', status: 'Completed', departure: '05:00', arrival: '14:20', date: '2026-07-05', distance: '560 km' },
      { id: 'TRP-8806', from: 'Lagos HQ', to: 'Port Harcourt', driver: 'Emeka Obi', vehicle: 'TRK-101', status: 'Completed', departure: '05:00', arrival: '15:30', date: '2026-06-25', distance: '617 km' },
      { id: 'TRP-8805', from: 'Abuja Terminal', to: 'Kano Hub', driver: 'Abubakar Garba', vehicle: 'TRK-107', status: 'Completed', departure: '09:00', arrival: '15:10', date: '2026-06-24', distance: '430 km' },
      { id: 'TRP-8804', from: 'Port Harcourt', to: 'Enugu Depot', driver: 'Fatima Bello', vehicle: 'TRK-102', status: 'Completed', departure: '08:00', arrival: '11:45', date: '2026-06-22', distance: '220 km' },
      { id: 'TRP-8803', from: 'Lagos HQ', to: 'Abuja Terminal', driver: 'Ngozi Okeke', vehicle: 'TRK-104', status: 'Completed', departure: '06:00', arrival: '14:15', date: '2026-06-18', distance: '762 km' },
      { id: 'TRP-8802', from: 'Kano Hub', to: 'Kaduna Yard', driver: 'Uche Eze', vehicle: 'VAN-201', status: 'Completed', departure: '07:00', arrival: '09:50', date: '2026-06-15', distance: '185 km' },
      { id: 'TRP-8801', from: 'Ibadan Depot', to: 'Lagos HQ', driver: 'Tunde Adeyemi', vehicle: 'VAN-202', status: 'Completed', departure: '08:00', arrival: '10:10', date: '2026-06-10', distance: '128 km' },
      { id: 'TRP-8799', from: 'Lagos HQ', to: 'Abuja Terminal', driver: 'Emeka Obi', vehicle: 'TRK-101', status: 'Completed', departure: '05:00', arrival: '13:10', date: '2026-05-28', distance: '762 km' },
      { id: 'TRP-8798', from: 'Port Harcourt', to: 'Calabar Depot', driver: 'Fatima Bello', vehicle: 'TRK-102', status: 'Completed', departure: '09:00', arrival: '12:15', date: '2026-05-20', distance: '190 km' },
      { id: 'TRP-8797', from: 'Abuja Terminal', to: 'Kano Hub', driver: 'Abubakar Garba', vehicle: 'TRK-107', status: 'Completed', departure: '08:00', arrival: '14:30', date: '2026-05-15', distance: '430 km' },
      { id: 'TRP-8796', from: 'Lagos HQ', to: 'Ibadan Depot', driver: 'Tunde Adeyemi', vehicle: 'VAN-202', status: 'Completed', departure: '07:00', arrival: '09:15', date: '2026-04-22', distance: '128 km' },
      { id: 'TRP-8795', from: 'Enugu Depot', to: 'Benin City', driver: 'Ngozi Okeke', vehicle: 'TRK-104', status: 'Completed', departure: '10:00', arrival: '14:50', date: '2026-04-10', distance: '280 km' }
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
      { id: 'MNT-441', vehicle: 'TRK-103', type: 'Engine Overhaul', tech: 'Ade Mechanics Ltd', date: '2026-07-10', cost: 480000, status: 'Maintenance', note: 'Cylinder head gasket replaced' },
      { id: 'MNT-440', vehicle: 'TRK-101', type: 'Oil & Filter Change', tech: 'In-house Workshop', date: '2026-07-08', cost: 15500, status: 'Completed', note: 'Used Mobil Delvac 15W40' },
      { id: 'MNT-439', vehicle: 'VAN-202', type: 'Brake Pad Replacement', tech: 'BrakePro Workshop', date: '2026-07-05', cost: 38000, status: 'Completed', note: 'Front and rear pads replaced' },
      { id: 'MNT-438', vehicle: 'TRK-102', type: 'Tire Rotation & Balancing', tech: 'In-house Workshop', date: '2026-07-01', cost: 7500, status: 'Completed', note: 'Rear tires rotated to front' },
      { id: 'MNT-437', vehicle: 'TRK-106', type: 'Full Inspection & Suspension repair', tech: 'TransitCare Ltd', date: '2026-06-28', cost: 115000, status: 'Completed', note: 'Replaced rear shock absorbers' },
      { id: 'MNT-436', vehicle: 'TRK-104', type: 'AC Compressor Service', tech: 'ChillyAutos Hub', date: '2026-06-18', cost: 45000, status: 'Completed', note: 'Recharged gas and replaced clutch' },
      { id: 'MNT-435', vehicle: 'VAN-201', type: 'Routine Oil Service', tech: 'In-house Workshop', date: '2026-06-10', cost: 12500, status: 'Completed', note: 'Standard filter changed' },
      { id: 'MNT-434', vehicle: 'TRK-107', type: 'Gearbox Calibration', tech: 'Mack Repairs Center', date: '2026-05-15', cost: 180000, status: 'Completed', note: 'Calibration and fluid change' },
      { id: 'MNT-433', vehicle: 'TRK-105', type: 'Alternator Replacement', tech: 'Ade Mechanics Ltd', date: '2026-04-12', cost: 65000, status: 'Completed', note: 'Replaced with OEM Bosch alternator' }
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
      { id: 'FL-1001', date: '2026-07-12', vehicle: 'TRK-101', litres: 280, rate: 820, total: 229600, station: 'NNPC Lagos' },
      { id: 'FL-1002', date: '2026-07-12', vehicle: 'TRK-102', litres: 320, rate: 820, total: 262400, station: 'Total PH' },
      { id: 'FL-1003', date: '2026-07-11', vehicle: 'VAN-201', litres: 80, rate: 810, total: 64800, station: 'Ardova Kano' },
      { id: 'FL-1004', date: '2026-07-11', vehicle: 'TRK-104', litres: 240, rate: 830, total: 199200, station: 'NNPC Abuja' },
      { id: 'FL-1005', date: '2026-07-09', vehicle: 'VAN-202', litres: 95, rate: 810, total: 76950, station: 'Oando Ibadan' },
      { id: 'FL-1006', date: '2026-07-07', vehicle: 'TRK-105', litres: 260, rate: 825, total: 214500, station: 'Mobil Enugu' },
      { id: 'FL-1007', date: '2026-07-05', vehicle: 'TRK-107', litres: 290, rate: 820, total: 237800, station: 'NNPC Kano' },
      { id: 'FL-1008', date: '2026-06-25', vehicle: 'TRK-101', litres: 270, rate: 780, total: 210600, station: 'Total Lagos' },
      { id: 'FL-1009', date: '2026-06-22', vehicle: 'TRK-102', litres: 310, rate: 780, total: 241800, station: 'Oando PH' },
      { id: 'FL-1010', date: '2026-06-18', vehicle: 'TRK-104', litres: 250, rate: 790, total: 197500, station: 'Ardova Abuja' },
      { id: 'FL-1011', date: '2026-06-15', vehicle: 'VAN-201', litres: 75, rate: 780, total: 58500, station: 'NNPC Kano' },
      { id: 'FL-1012', date: '2026-06-10', vehicle: 'VAN-202', litres: 90, rate: 780, total: 70200, station: 'Mobil Lagos' },
      { id: 'FL-1013', date: '2026-05-28', vehicle: 'TRK-101', litres: 275, rate: 750, total: 206250, station: 'NNPC Lagos' },
      { id: 'FL-1014', date: '2026-05-20', vehicle: 'TRK-102', litres: 300, rate: 750, total: 225000, station: 'Total PH' },
      { id: 'FL-1015', date: '2026-04-22', vehicle: 'VAN-202', litres: 85, rate: 720, total: 61200, station: 'Oando Ibadan' }
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

