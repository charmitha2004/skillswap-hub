const Request = require('../models/Request');

const sendRequest = async (req, res) => {
  const { receiverId, skill = '', title, description = '' } = req.body;

  try {
    if (receiverId && String(req.user.id) === String(receiverId)) {
      return res.status(400).json({ message: 'You cannot send a request to yourself' });
    }

    const existingRequest = receiverId
      ? await Request.findPending({ userId: req.user.id, receiverId })
      : null;

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    const request = await Request.create({
      userId: req.user.id,
      receiverId: receiverId || null,
      title: title || skill || 'Connection request',
      description,
      skill,
    });

    res.status(201).json({ message: 'Request sent successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Error sending request' });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await Request.listForUser(req.user.id);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

const updateRequest = async (req, res) => {
  const { status } = req.body;

  try {
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const request = await Request.updateStatus({
      requestId: req.params.requestId,
      userId: req.user.id,
      status,
    });

    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.status(200).json({ message: `Request ${status}`, request });
  } catch (error) {
    res.status(500).json({ message: 'Error updating request' });
  }
};

module.exports = { sendRequest, getRequests, updateRequest };
