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

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Backend is running correctly.' });
});

// Seed function
const Driver = require('./src/models/Driver');
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

// Start Server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await seedDrivers();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
