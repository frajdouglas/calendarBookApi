// getGoogleRefreshToken.js
const { google } = require('googleapis');
const readline = require('readline');
require('dotenv').config();

// Replace with your actual client ID and secret
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
console.log(REDIRECT_URI)
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// These are the scopes for Google Calendar and Meet links
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

// 1. Generate the auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline', // <-- Important for getting refresh_token
  scope: SCOPES,
  prompt: 'consent',       // <-- Force prompt to ensure refresh_token is returned
});

console.log('\nAuthorize this app by visiting the URL below:\n');
console.log(authUrl);

// 2. After visiting the URL, paste the code below
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\nPaste the code from the redirect URL here: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ Tokens received!');
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('\n⚠️ Store the refresh_token securely (e.g., in .env)\n');
    rl.close();
  } catch (error) {
    console.error('❌ Error retrieving tokens:', error);
    rl.close();
  }
});
