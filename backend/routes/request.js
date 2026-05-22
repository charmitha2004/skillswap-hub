const express = require('express');
const auth = require('../middleware/auth');
const { getRequests, sendRequest, updateRequest } = require('../controllers/requestController');
const router = express.Router();

router.post('/', auth, sendRequest);
router.get('/', auth, getRequests);
router.patch('/:requestId', auth, updateRequest);

module.exports = router;
