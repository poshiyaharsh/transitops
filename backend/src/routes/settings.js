const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const User = require('../models/User');

// Helper to get or create settings
async function getSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
    await settings.save();
  }
  return settings;
}

// GET /api/settings - Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/settings - Update settings
router.put('/', async (req, res) => {
  try {
    const { company, rbac, notifications, theme } = req.body;
    let settings = await getSettings();

    if (company) settings.company = company;
    if (rbac) {
      settings.rbac = rbac;
      settings.markModified('rbac');
    }
    if (notifications) {
      settings.notifications = notifications;
      settings.markModified('notifications');
    }
    if (theme) settings.theme = theme;

    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
