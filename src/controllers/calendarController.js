const { getFilteredEvents, createEvent } = require('../services/calendarService');

exports.getAvailability = async (req, res) => {
  const accessToken = req.accessToken;

  if (!accessToken) {
    return res.status(400).send('Access token is missing or invalid');
  }

  try {
    const filteredEvents = await getFilteredEvents(accessToken);
    res.json(filteredEvents);
  } catch (error) {
    console.error('Error fetching calendar availability:', error);
    res.status(500).send('Error fetching calendar availability');
  }
};

exports.postEvent = async (req, res) => {
  const accessToken = req.accessToken;
  if (!accessToken) {
    return res.status(400).send('Access token is missing or invalid');
  }

  const { name, email, meetingStartTime, extraDetails } = req.body;
  if (!name || !email || !meetingStartTime) {
    return res.status(400).send('Missing required fields: name, email, meetingStartTime, extraDetails');
  }

  try {
    const eventDetails = { name, email, meetingStartTime, extraDetails };
    const createdEvent = await createEvent(accessToken, eventDetails);
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).send('Error creating calendar event');
  }
};