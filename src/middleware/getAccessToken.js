const tokenStore = require('../utils/tokenStore');
const refreshAccessToken = require('../utils/refreshAccessToken');

const getAccessToken = async (req, res, next) => {
    console.log('getAccessToken middleware called');
  try {
    // Check if we already have a valid access token in memory
    let accessToken = tokenStore.get('accessToken');
    let expiresAt = tokenStore.get('expiresAt');
    console.log(accessToken, expiresAt)
    // If no access token or expired
    if (!accessToken || Date.now() > expiresAt) {
      console.log('Access token is missing or expired. Refreshing token...');
      
      // Refresh the token using the refresh token stored earlier
      accessToken = await refreshAccessToken();
      console.log(accessToken)
      // Store the new access token and expiration time in memory
      tokenStore.set('accessToken', accessToken.token);
      tokenStore.set('expiresAt', Date.now() + accessToken.expiresIn * 1000); // expiresIn is in seconds
    
      console.log(tokenStore)    
    }
    
    // Attach the valid access token to the request object for use in the route
    req.accessToken = accessToken;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error refreshing or fetching access token:', error);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
};
module.exports = getAccessToken;