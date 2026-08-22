const express = require('express');
const router = express.Router();
const { getActivities, getCities, getCityDetails } = require('../controllers/cityController');

router.get('/', getCities);
router.get('/activities/search', getActivities);
router.get('/:id', getCityDetails);

module.exports = router;
