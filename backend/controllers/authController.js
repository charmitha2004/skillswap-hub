const User = require('../models/User');
const { createToken } = require('../utils/tokens');

const signup = async (req, res) => {
  const { name, email, password, department = 'General' } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, department });
    const token = createToken({ id: user.id });

    res.status(201).json({ token, user: User.toSafeObject(user) });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user || !User.comparePassword(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createToken({ id: user.id });
    res.status(200).json({ token, user: User.toSafeObject(user) });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

const me = (req, res) => {
  res.json(User.toSafeObject(req.user));
};

module.exports = { signup, login, me };
