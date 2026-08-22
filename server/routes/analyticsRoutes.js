const express = require('express');
const router = express.Router();
const { getGlobalAnalytics } = require('../controllers/analyticsController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', protect, requireAdmin, getGlobalAnalytics);

module.exports = router;
