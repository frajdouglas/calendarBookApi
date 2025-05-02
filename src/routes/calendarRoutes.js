const express = require('express');
const getAccessToken = require('../middleware/getAccessToken');
const { getAvailability } = require('../controllers/calendarController');

const router = express.Router();

// Calendar availability route
router.get('/availability', getAccessToken, getAvailability);

module.exports = router;