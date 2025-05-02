const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const getAccessToken = require('./middleware/getAccessToken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Calendar Booking API' });
});

app.get('/calendar/availability' , getAccessToken , async (req, res) => {
  const accessToken = req.accessToken;  // Access the token from req
  const timeMin = new Date().toISOString(); // Current date
  const timeMax = new Date();
  timeMax.setMonth(timeMax.getMonth() + 1); // Two months ahead
  const timeMaxISO = timeMax.toISOString();
    if (!accessToken) {
        return res.status(400).send('Access token is missing or invalid');
    }

    try {
      // Initialize the Google Calendar API client
      // const calendar = google.calendar({ version: 'v3', auth: accessToken });

      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
  
      // Initialize the Google Calendar API client
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  

      // Define the parameters for the availability query
      const params = {
          calendarId: 'primary',  // Use 'primary' for the primary calendar
          timeMin: timeMin,  // The start time of the window (ISO string)
          timeMax: timeMaxISO,  // The end time of the window (ISO string)
          singleEvents: true,  // Only single events (not recurring ones)
          orderBy: 'startTime',  // Order events by start time
      };

      // Call the Google Calendar API to get the events in the specified time range
      const response = await calendar.events.list(params);

      // Return the event data
      console.log(response.data.items)
      return response.data.items;  // List of events in the specified time range
  } catch (error) {
      throw new Error('Error fetching calendar availability: ' + error.message);
  }
});

// I DONT THINK WE WANT THIS IN PRODUCTION, IT IS A ONE TIME THING
app.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;  // This is where the authorization code is sent by Google
    console.log(code)
    if (!code) {
      return res.status(400).send('Missing authorization code');
    }
  });

// Only start the server if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app; 