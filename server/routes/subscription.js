const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Subscription = require('../models/Subscription');
const {
  subscribeToUser,
  getSubscriptions
} = require('../controllers/subscriptionController');

const checkSubscription = async (req, res) => {
  try {
    const existing = await Subscription.findOne({
      subscriber: req.userId,
      targetUser: req.params.id
    });

    res.json({ subscribed: !!existing });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

router.post('/:id', auth, subscribeToUser);
router.get('/', auth, getSubscriptions);
// Маршрут
router.get('/check/:id', auth, checkSubscription);

// Підписка на користувача
router.post('/:followedId', auth, async (req, res) => {
  try {
    const existing = await Subscription.findOne({ follower: req.userId, followed: req.params.followedId });
    if (existing) return res.status(400).json({ message: 'Already subscribed' });

    const newSub = new Subscription({
      follower: req.userId,
      followed: req.params.followedId
    });
    await newSub.save();
    res.json({ message: 'Subscribed' });
  } catch (err) {
    res.status(500).json({ message: 'Error subscribing' });
  }
});

// Перевірка підписки
router.get('/check/:followedId', auth, async (req, res) => {
  const exists = await Subscription.exists({ follower: req.userId, followed: req.params.followedId });
  res.json({ subscribed: !!exists });
});
router.get('/check/:id', auth, checkSubscription);

router.get('/check/:id', auth, async (req, res) => {
  try {
    const existing = await Subscription.findOne({
      subscriber: req.userId,
      targetUser: req.params.id
    });

    res.json({ subscribed: !!existing });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
