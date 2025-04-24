const express = require('express');
const cors = require('cors');
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

app.get('/calendar/availability', async (req, res) => {
    // Set the refresh token to get access token
    oauth2Client.setCredentials({
      refresh_token: 'YOUR_REFRESH_TOKEN'
    });
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