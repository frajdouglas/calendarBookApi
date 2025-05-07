// /src/middleware/validationMiddleware.js
const { body } = require('express-validator');

const validateBody = [
  body('name')
    .notEmpty().withMessage('Event name is required')
    .isString().withMessage('Name must be a string')
    .trim()
    .escape(),

  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),

  body('meetingStartTime')
    .isISO8601().withMessage('Start time must be a valid ISO date string'),

  body('timeZone')
    .notEmpty().withMessage('Time zone is required')
    .isString().withMessage('Time zone must be a string'),

  body('extraDetails')
    .optional()
    .trim()
    .escape(),
];

module.exports = validateBody;


