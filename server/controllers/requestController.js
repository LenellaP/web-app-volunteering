const Request = require('../models/Request');

exports.createRequest = async (req, res) => {
  try {
    const { title, description, location, date } = req.body;
    const request = new Request({
      title,
      description,
      location,
      date,
      user: req.userId
    });
    await request.save();

    const Subscription = require('../models/Subscription');

    const subscriptions = await Subscription.find({ followed: req.userId }).populate('follower');
      subscriptions.forEach(sub => {
        const socketId = getSocketIdForUser(sub.follower._id); 
        if (socketId) {
          io.to(socketId).emit('newPostNotification', {
            userId: req.userId,
            message: 'Користувач, на якого ви підписані, створив нове оголошення',
    });
  }
});


    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Error creating request' });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate('user', 'username');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

// Отримання запитів поточного користувача
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні власних запитів' });
  }
};

exports.getRequestsByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const requests = await Request.find({ user: userId }); 
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Помилка отримання запитів користувача' });
  }
};
