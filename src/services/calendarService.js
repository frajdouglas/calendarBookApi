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
  console.log(eventDetails.meetingStartTime, 'startDateTime', typeof eventDetails.meetingStartTime);

  const startDateTime = new Date(eventDetails.meetingStartTime);
  const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000); // Add 30 minutes

console.log(startDateTime, startDateTime.toISOString(), endDateTime, eventDetails.timeZone);
console.log(typeof startDateTime, typeof endDateTime, typeof eventDetails.timeZone, typeof eventDetails.email);
  const event = {
    'summary': `WeBuild introduction call with ${eventDetails.name}`,
    'description': `${eventDetails.extraDetails}`,
    'start': {
      'dateTime': startDateTime.toISOString(),
      'timeZone': `${eventDetails.timeZone}`,
    },
    'end': {
      'dateTime': endDateTime.toISOString(),
      'timeZone': `${eventDetails.timeZone}`,
    },
    'attendees': [
      {'email': `${eventDetails.email}`},
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 60},
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`, // must be unique per event
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        }
      }
    }
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1 // Required to enable Google Meet
    });

    return response.data; 
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error('Failed to create calendar event');
  }
};