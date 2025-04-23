const request = require('supertest');
const app = require('../index');

describe('Root Endpoint', () => {
  it('should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Welcome to the Calendar Booking API'
    });
  });
}); 