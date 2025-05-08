// const tokenStore = require('../utils/tokenStore');
const refreshAccessToken = require('../utils/refreshAccessToken');


let tokenStore = { accessToken: null, expiresAt: null }

const getAccessToken = async (req, res, next) => {
  try {

    if (!tokenStore.accessToken || Date.now() > tokenStore.expiresAt) {

      // Refresh the token using the refresh token stored earlier
      let newTokenObject = await refreshAccessToken();
      tokenStore.accessToken = newTokenObject.access_token;
      tokenStore.expiresAt = Date.now() + newTokenObject.expires_in * 1000;
    }

    // Attach the valid access token to the request object for use in the route
    req.accessToken = tokenStore.accessToken;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error refreshing or fetching access token:', error);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
};
module.exports = getAccessToken;