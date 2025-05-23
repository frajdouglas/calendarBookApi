const express = require('express');
const cors = require('cors');
require('dotenv').config();
const calendarRoutes = require('./routes/calendarRoutes');
const apiRateLimiter = require('./middleware/rateLimiter');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.set('trust proxy', 1);
app.use(cors({
  origin: ['https://webuild-three.vercel.app', 'https://congenial-carnival-xqr6pxwqx6pf65gv-3000.app.github.dev'],
})); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiRateLimiter);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Calendar Booking API' });
});
app.use('/calendar', calendarRoutes);

// Start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;