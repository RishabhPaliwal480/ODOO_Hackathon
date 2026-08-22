const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { validate } = require('../middleware/validationMiddleware');
const { authRules } = require('../validators/tripValidators');

router.post('/login', validate(authRules), login);
router.post('/register', validate(authRules), register);

module.exports = router;