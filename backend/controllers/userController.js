const User = require('../models/User');

const getUsers = async (_req, res) => {
  try {
    const users = await User.list();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(User.toSafeObject(user));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

const updateUser = async (req, res) => {
  try {
    if (String(req.user.id) !== String(req.params.userId)) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }

    const user = await User.updateProfile(req.user.id, req.body);
    res.json(User.toSafeObject(user));
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

module.exports = { getUser, getUsers, updateUser };
