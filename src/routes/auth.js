import express from 'express';
import { getAuthUrl, getTokens } from '../google/auth.js';

const router = express.Router();

// Initiate Google OAuth flow
router.get('/google', (req, res) => {
  const authUrl = getAuthUrl();
  res.json({ authUrl });
});

// Handle OAuth callback
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const tokens = await getTokens(code);
    
    // Log the refresh token - you'll need to save this in your .env file
    // console.log('Refresh Token:', tokens.refresh_token);
    // console.log('Access Token:', tokens.access_token);
    // console.log('Expiry Date:', new Date(tokens.expiry_date));

    res.json({ 
      message: 'Authentication successful',
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
      expiryDate: new Date(tokens.expiry_date)
    });
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router; 