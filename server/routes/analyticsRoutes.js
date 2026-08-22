const express = require('express');
const router = express.Router();
const { getGlobalAnalytics } = require('../controllers/analyticsController');

router.get('/', getGlobalAnalytics);

module.exports = router;