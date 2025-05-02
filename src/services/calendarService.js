const { google } = require('googleapis');

exports.getFilteredEvents = async (accessToken) => {
  const timeMin = new Date().toISOString();
  const timeMax = new Date();
  timeMax.setMonth(timeMax.getMonth() + 1);
  const timeMaxISO = timeMax.toISOString();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const params = {
    calendarId: 'primary',
    timeMin,
    timeMax: timeMaxISO,
    singleEvents: true,
    orderBy: 'startTime',
  };

  const response = await calendar.events.list(params);

  const summaryFilterName = 'FREE';
  return response.data.items
    .filter(event => event.summary && event.summary.includes(summaryFilterName))
    .map(event => ({
      start: event.start,
      end: event.end,
      summary: event.summary,
    }));
};

exports.createEvent = async (accessToken, eventDetails) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary: eventDetails.summary,
    description: eventDetails.description,
    start: { dateTime: eventDetails.start, timeZone: 'UTC' },
    end: { dateTime: eventDetails.end, timeZone: 'UTC' },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return response.data; // Return the created event details
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error('Failed to create calendar event');
  }
};