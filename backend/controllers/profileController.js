const User = require('../models/User');

const cleanSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((skill) => skill.trim()).filter(Boolean);
  }

  return String(skills || '')
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
};

const getProfile = (req, res) => {
  res.status(200).json(User.toSafeObject(req.user));
};

const updateProfile = async (req, res) => {
  try {
    const updates = {
      teachSkills: cleanSkills(req.body.teachSkills),
      learnSkills: cleanSkills(req.body.learnSkills),
    };

    const updatedUser = await User.updateProfile(req.user.id, updates);
    res.status(200).json(User.toSafeObject(updatedUser));
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile' });
  }
};

module.exports = { getProfile, updateProfile };
