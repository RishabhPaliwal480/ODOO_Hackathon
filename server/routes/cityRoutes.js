const express = require('express');
const router = express.Router();
const { getCities, getCityDetails } = require('../controllers/cityController');

router.get('/', getCities);
router.get('/:id', getCityDetails);

module.exports = router;