const { getFilteredEvents } = require('../services/calendarService');

exports.getAvailability = async (req, res) => {
  const accessToken = req.accessToken;

  if (!accessToken) {
    return res.status(400).send('Access token is missing or invalid');
  }

  try {
    const filteredEvents = await getFilteredEvents(accessToken);
    console.log('Filtered Events:', filteredEvents);
    res.json(filteredEvents);
  } catch (error) {
    console.error('Error fetching calendar availability:', error);
    res.status(500).send('Error fetching calendar availability');
  }
};