const express = require('express');
const auth = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/profileController');
const router = express.Router();

router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);

module.exports = router;
