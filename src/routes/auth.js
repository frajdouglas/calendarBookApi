import express from 'express';
import { getAuthUrl, getTokens } from '../google/auth.js';

const router = express.Router();

// Initiate Google OAuth flow
router.get('/google', (req, res) => {
  const authUrl = getAuthUrl();
  res.json({ authUrl });
});

// Handle OAuth callback, this is not used in the app, but can be used to get a new refresh token
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }
    const tokens = await getTokens(code);
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