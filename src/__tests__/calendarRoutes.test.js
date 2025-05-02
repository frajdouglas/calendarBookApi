const request = require('supertest');
const app = require('../index');
const { google } = require('googleapis');

// Mock the Google Calendar API
jest.mock('googleapis', () => {
  const mockEventsList = jest.fn();
  return {
    google: {
      auth: {
        OAuth2: jest.fn(() => ({
          setCredentials: jest.fn(),
        })),
      },
      calendar: jest.fn(() => ({
        events: {
          list: mockEventsList,
        },
      })),
    },
  };
});

describe('GET /calendar/availability', () => {
  it('should return filtered events with summary "FREE"', async () => {
    // Mock the response from Google Calendar API
    const mockEvents = {
      data: {
        items: [
          { summary: 'FREE Slot 1', start: { dateTime: '2025-05-02T10:00:00Z' }, end: { dateTime: '2025-05-02T11:00:00Z' } },
          { summary: 'Busy Slot', start: { dateTime: '2025-05-02T12:00:00Z' }, end: { dateTime: '2025-05-02T13:00:00Z' } },
          { summary: 'FREE Slot 2', start: { dateTime: '2025-05-02T14:00:00Z' }, end: { dateTime: '2025-05-02T15:00:00Z' } },
        ],
      },
    };

    google.calendar().events.list.mockResolvedValue(mockEvents);

    // Make the request to the endpoint
    const response = await request(app)
      .get('/calendar/availability')
      .set('Authorization', 'Bearer mockAccessToken'); // Mock access token

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        summary: 'FREE Slot 1',
        start: { dateTime: '2025-05-02T10:00:00Z' },
        end: { dateTime: '2025-05-02T11:00:00Z' },
      },
      {
        summary: 'FREE Slot 2',
        start: { dateTime: '2025-05-02T14:00:00Z' },
        end: { dateTime: '2025-05-02T15:00:00Z' },
      },
    ]);
  });


  it('should return 500 if Google Calendar API fails', async () => {
    google.calendar().events.list.mockRejectedValue(new Error('Google API Error'));

    const response = await request(app)
      .get('/calendar/availability')
      .set('Authorization', 'Bearer mockAccessToken'); // Mock access token

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error fetching calendar availability');
  });
});