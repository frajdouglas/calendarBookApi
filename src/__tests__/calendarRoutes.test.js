const request = require('supertest');
const app = require('../index');
const { google } = require('googleapis');

// Mock the Google Calendar API
jest.mock('googleapis', () => {
  const mockEventsList = jest.fn();
  const mockEventsInsert = jest.fn();
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
          insert: mockEventsInsert,
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

describe('POST /calendar/event', () => {
  const validEvent = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    meetingStartTime: '2025-05-03T10:00:00Z',
    timeZone: 'UTC',
    extraDetails: 'Discuss project updates',
  };

  it('should create a Google Meet event and return 201', async () => {
    const mockEventResponse = {
      id: 'mockEventId',
      summary: 'WeBuild introduction call with John Doe',
      start: { dateTime: '2025-05-03T10:00:00Z', timeZone: 'UTC' },
      end: { dateTime: '2025-05-03T10:30:00Z', timeZone: 'UTC' },
      attendees: [{ email: 'johndoe@example.com' }],
      conferenceData: {
        entryPoints: [
          { uri: 'https://meet.google.com/mock-meet-link', entryPointType: 'video' },
        ],
      },
    };

    google.calendar().events.insert.mockResolvedValue({ data: mockEventResponse });

    const response = await request(app)
      .post('/calendar/event')
      .set('Authorization', 'Bearer mockAccessToken')
      .send(validEvent);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockEventResponse);
  });

  it('should return 400 if required fields are missing', async () => {
    const invalidEvent = { ...validEvent };
    delete invalidEvent.name; // Remove a required field

    const response = await request(app)
      .post('/calendar/event')
      .set('Authorization', 'Bearer mockAccessToken')
      .send(invalidEvent);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Missing required fields: name, email, meetingStartTime, extraDetails');
  });

  it('should return 400 if access token is missing', async () => {
    const response = await request(app)
      .post('/calendar/event')
      .send(validEvent); // No Authorization header

    expect(response.status).toBe(400);
    expect(response.text).toBe('Access token is missing or invalid');
  });

  it('should return 500 if Google Calendar API fails', async () => {
    google.calendar().events.insert.mockRejectedValue(new Error('Google API Error'));

    const response = await request(app)
      .post('/calendar/event')
      .set('Authorization', 'Bearer mockAccessToken')
      .send(validEvent);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error creating calendar event');
  });

  it('should return 400 if email format is invalid', async () => {
    const invalidEvent = { ...validEvent, email: 'invalid-email' }; // Invalid email format

    const response = await request(app)
      .post('/calendar/event')
      .set('Authorization', 'Bearer mockAccessToken')
      .send(invalidEvent);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'Valid email is required' }),
      ])
    );
  });

  it('should return 400 if meetingStartTime is not a valid ISO date', async () => {
    const invalidEvent = { ...validEvent, meetingStartTime: 'invalid-date' }; // Invalid date format

    const response = await request(app)
      .post('/calendar/event')
      .set('Authorization', 'Bearer mockAccessToken')
      .send(invalidEvent);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'Start time must be a valid ISO date string' }),
      ])
    );
  });
});