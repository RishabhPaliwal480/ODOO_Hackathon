const express = require('express');
const {
  getSavedDestinations,
  removeSavedDestination,
  saveDestination,
  updateProfile,
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.patch('/', updateProfile);
router.get('/saved-destinations', getSavedDestinations);
router.post('/saved-destinations/:cityId', saveDestination);
router.delete('/saved-destinations/:cityId', removeSavedDestination);

module.exports = router;
