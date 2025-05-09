# Node.js Calendar Booking API with Google Calendar Integration

A Node.js application built with Express.js to streamline calendar booking management and seamlessly integrate with Google Calendar. This API allows you to fetch availability, create new events, and potentially manage other calendar-related tasks programmatically.

---

## **Table of Contents**
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [GET `/`](#get-)
  - [GET `/calendar/availability`](#get-calendaravailability)
  - [POST `/calendar/event`](#post-calendarevent)
- [Testing](#testing)
- [Rate Limiting](#rate-limiting)
- [Security Considerations](#security-considerations)

---

## **Prerequisites**
- Node.js (v14 or higher)
- npm (v6 or higher)
- A Google Cloud project with the Calendar API enabled
- A valid `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `REFRESH_TOKEN`

---

## **Installation**
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd calendarBookApi
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## **Running the Application**

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3000 by default. You can change this by setting the PORT environment variable.

---

## **Environment Variables**

Create a `.env` file in the root directory with the following variables:
```
PORT=3000
NODE_ENV=development
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
REFRESH_TOKEN=<your-refresh-token>
```

---

## **API Endpoints**

### GET `/`
Welcome message

### GET `/calendar/availability`
Fetches available time slots from the calendar.

### POST `/calendar/event`
Creates a new event in the calendar.

---

## **Testing**
Run the following command to execute tests:
```bash
npm test
```

---

## **Rate Limiting**
The application implements rate limiting to prevent abuse. Configure rate limiting settings in the 'middleware/rateLimiter.js' file.

---

## **Refresh Token**

The api uses the google calendar api to interact with your calendar. You must get a refresh token to enable this express api to use the google calendar api.
You can run the script 'getGoogleRefreshtoken.js' to fetch a new refresh token.
You will need a server running to receive the redirect you have set, for example : http://localhost:3000/oauth2callback

