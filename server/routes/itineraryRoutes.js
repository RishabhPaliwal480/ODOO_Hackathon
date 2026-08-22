const express = require('express');
const router = express.Router();
const { addStop, addActivity, deleteStop, deleteActivity } = require('../controllers/itineraryController');

router.post('/stops', addStop);
router.delete('/stops/:id', deleteStop);
router.post('/activities', addActivity);
router.delete('/activities/:id', deleteActivity);

module.exports = router;