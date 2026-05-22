const User = require('../models/User');
const Request = require('../models/Request');

const lower = (values = []) => values.map((value) => value.toLowerCase());

const getMatchesAsData = async (user) => {
  const wantedSkills = lower(user.learnSkills);
  if (!wantedSkills.length) return [];

  const users = await User.search({ userId: user.id });
  return users
    .map((candidate) => ({
      ...candidate,
      matchedSkills: candidate.teachSkills.filter((skill) => wantedSkills.includes(skill.toLowerCase())),
    }))
    .filter((candidate) => candidate.matchedSkills.length > 0);
};

const getMatches = async (req, res) => {
  try {
    const results = await getMatchesAsData(req.user);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching matches' });
  }
};

const getMatchSummary = async (req, res) => {
  try {
    const [activeUsers, totalRequests, matches] = await Promise.all([
      User.count(),
      Request.countAll(),
      getMatchesAsData(req.user),
    ]);

    res.json({
      totalRequests,
      matchesFound: matches.length,
      activeUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching summary' });
  }
};

module.exports = { getMatches, getMatchSummary };
