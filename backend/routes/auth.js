const express = require('express');
const auth = require('../middleware/auth');
const { login, me, signup } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, me);

module.exports = router;
