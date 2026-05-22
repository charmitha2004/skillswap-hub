const express = require('express');
const auth = require('../middleware/auth');
const { getMatches, getMatchSummary } = require('../controllers/matchController');
const router = express.Router();

router.get('/summary', auth, getMatchSummary);
router.get('/', auth, getMatches);

module.exports = router;
