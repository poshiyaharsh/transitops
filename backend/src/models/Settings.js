const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, default: 'TransitOps Nigeria Ltd' },
  registrationNumber: { type: String, default: 'RC-2019-884421' },
  contactEmail: { type: String, default: 'ops@transitops.io' },
  phone: { type: String, default: '+234 800 123 4567' },
  address: { type: String, default: 'Plot 14B, Victoria Island, Lagos' },
  industry: { type: String, default: 'Logistics & Transport' },
});

const themeSchema = new mongoose.Schema({
  appearance: { type: String, enum: ['Dark', 'Light', 'System'], default: 'Light' },
  accentColor: { type: String, default: '#3B82F6' },
});

const settingsSchema = new mongoose.Schema({
  company: { type: companySchema, default: () => ({}) },
  rbac: { type: mongoose.Schema.Types.Mixed, default: {} },
  notifications: { type: mongoose.Schema.Types.Mixed, default: {} },
  theme: { type: themeSchema, default: () => ({}) }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings;
