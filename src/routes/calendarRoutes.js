const express = require('express');
const getAccessToken = require('../middleware/getAccessToken');
const validateBody = require('../middleware/validateBody');
const { getAvailability, postEvent } = require('../controllers/calendarController');

const router = express.Router();
router.get('/availability', getAccessToken, getAvailability);
router.post('/event', getAccessToken, validateBody, postEvent);

module.exports = router;