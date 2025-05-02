const express = require('express');
const getAccessToken = require('../middleware/getAccessToken');
const { getAvailability, createEvent } = require('../controllers/calendarController');

const router = express.Router();
console.log('calendarRoutes.js loaded');
// Calendar availability route
router.get('/availability', getAccessToken, getAvailability);

// Calendar create event route WHY WORKS WHEN GET BUT NOT POST
router.get('/event', getAccessToken, createEvent);

// router.post('/event', (req, res, next) => {
//     console.log('POST /calendar/event route triggered');
//     next();
//   }, getAccessToken, createEvent);
module.exports = router;