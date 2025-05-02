const axios = require('axios');
require('dotenv').config();

const refreshAccessToken = async () => {
    console.log(process.env.GOOGLE_CLIENT_ID, 'CLIENT ID')         // Replace with your actual client ID
    console.log(process.env.GOOGLE_CLIENT_SECRET, 'CLIENT SECRET')  // Replace with your actual client secret
        console.log(process.env.REFRESH_TOKEN, 'REFRESH TOKEN')
    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,          // Replace with your actual client ID
            client_secret: process.env.GOOGLE_CLIENT_SECRET,  // Replace with your actual client secret
            refresh_token: process.env.REFRESH_TOKEN,          // The refresh token you have
            grant_type: 'refresh_token',
        }));
console.log(response.data)
        // Return the new access token from the response
        return response.data;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw new Error('Failed to refresh access token');
    }
};
// refreshAccessToken()
module.exports = refreshAccessToken;