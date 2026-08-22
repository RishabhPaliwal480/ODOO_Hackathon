const express = require('express');
const router = express.Router();
const { getUserTrips, getTripById, createTrip, deleteTrip, getSharedTrip, copyTrip } = require('../controllers/tripController');

router.get('/shared/:slugOrId', getSharedTrip);
router.post('/copy/:tripId', copyTrip);
router.route('/').get(getUserTrips).post(createTrip);
router.route('/:id').get(getTripById).delete(deleteTrip);

module.exports = router;