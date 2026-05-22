const express = require('express');
const auth = require('../middleware/auth');
const { getUser, getUsers, updateUser } = require('../controllers/userController');

const router = express.Router();

router.get('/', auth, getUsers);
router.get('/:userId', auth, getUser);
router.put('/:userId', auth, updateUser);

module.exports = router;
