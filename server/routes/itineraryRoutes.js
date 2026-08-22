const express = require('express');
const router = express.Router();
const { addStop, addActivity, deleteStop, deleteActivity } = require('../controllers/itineraryController');
const { validate } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { activityRules, stopRules } = require('../validators/tripValidators');

router.use(protect);
router.post('/stops', validate(stopRules), addStop);
router.delete('/stops/:id', deleteStop);
router.post('/activities', validate(activityRules), addActivity);
router.delete('/activities/:id', deleteActivity);

module.exports = router;
