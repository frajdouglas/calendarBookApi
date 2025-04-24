// In-memory store for access tokens and expiration times
const tokenStore = {
    accessToken: null,
    expiresAt: null,
  
    // Get a value from the store
    get: (key) => {
      return tokenStore[key];
    },
  
    // Set a value in the store
    set: (key, value) => {
      tokenStore[key] = value;
    },
  
    // Clear the store (useful for logout or manual token reset)
    clear: () => {
      tokenStore.accessToken = null;
      tokenStore.expiresAt = null;
    }
  };
  
  module.exports = tokenStore;
  