const express = require('express');
const getAccessToken = require('../middleware/getAccessToken');
const { getAvailability, postEvent } = require('../controllers/calendarController');

const router = express.Router();
router.get('/availability', getAccessToken, getAvailability);
router.post('/event', getAccessToken, postEvent);

module.exports = router;