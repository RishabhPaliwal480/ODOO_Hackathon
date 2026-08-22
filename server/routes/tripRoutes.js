const express = require('express');
const router = express.Router();
const {
  copyTrip,
  createTrip,
  deleteTrip,
  getPublicTrips,
  getSharedTrip,
  getTripById,
  getUserTrips,
  updateTrip,
} = require('../controllers/tripController');
const { validate } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { createTripRules } = require('../validators/tripValidators');

router.get('/shared/:slugOrId', getSharedTrip);
router.get('/public/feed', getPublicTrips);
router.post('/copy/:tripId', protect, copyTrip);
router.route('/').get(protect, getUserTrips).post(protect, validate(createTripRules), createTrip);
router.route('/:id').get(protect, getTripById).patch(protect, updateTrip).delete(protect, deleteTrip);

module.exports = router;
