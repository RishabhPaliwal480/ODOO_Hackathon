const express = require('express');
const router = express.Router();
const { login, me, register } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { authRules } = require('../validators/authValidators');

router.post('/login', validate(authRules), login);
router.post('/register', validate(authRules), register);
router.get('/me', protect, me);

module.exports = router;
