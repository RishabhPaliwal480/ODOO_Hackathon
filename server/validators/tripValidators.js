const { body } = require('express-validator');

const createTripRules = [
  body('title').trim().notEmpty().withMessage('Trip title is required').isLength({ min: 3, max: 150 }),
  body('start_date').notEmpty().withMessage('Start date is required').isISO8601().withMessage('Valid start date required'),
  body('end_date').notEmpty().withMessage('End date is required').isISO8601().withMessage('Valid end date required'),
  body('estimated_budget').optional().isFloat({ min: 0 }).withMessage('Budget must be positive'),
];

const authRules = [
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

module.exports = { createTripRules, authRules };