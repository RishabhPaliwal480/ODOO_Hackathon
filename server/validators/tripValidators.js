const { body } = require('express-validator');

const createTripRules = [
  body('title').trim().notEmpty().withMessage('Trip title is required').isLength({ min: 3, max: 150 }),
  body('start_date').notEmpty().withMessage('Start date is required').isISO8601().withMessage('Valid start date required'),
  body('end_date').notEmpty().withMessage('End date is required').isISO8601().withMessage('Valid end date required'),
  body('estimated_budget').optional().isFloat({ min: 0 }).withMessage('Budget must be positive'),
  body('is_public').optional().isBoolean().withMessage('Public flag must be a boolean'),
];

const authRules = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const stopRules = [
  body('trip_id').isUUID().withMessage('Valid trip id required'),
  body('city_id').isUUID().withMessage('Valid city id required'),
  body('arrival_date').isISO8601().withMessage('Valid arrival date required'),
  body('departure_date').isISO8601().withMessage('Valid departure date required'),
  body('lodging_cost').optional().isFloat({ min: 0 }).withMessage('Lodging cost must be positive'),
  body('transport_cost').optional().isFloat({ min: 0 }).withMessage('Transport cost must be positive'),
];

const activityRules = [
  body('trip_stop_id').isUUID().withMessage('Valid trip stop id required'),
  body('activity_id').optional({ nullable: true }).isUUID().withMessage('Valid activity id required'),
  body('custom_title').optional().trim().isLength({ min: 2, max: 150 }).withMessage('Title must be 2-150 characters'),
  body('day_number').optional().isInt({ min: 1 }).withMessage('Day must be positive'),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be positive'),
];

module.exports = { activityRules, authRules, createTripRules, stopRules };
