const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  subscribeToUser,
  getSubscriptions,
  checkSubscription
} = require('../controllers/subscriptionController');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Post = require('../models/Post');

// Підписка на користувача
router.post('/:id', auth, subscribeToUser);

// Отримати список підписок
router.get('/', auth, getSubscriptions);

// Перевірка чи підписаний
router.get('/check/:id', auth, checkSubscription);

router.get('/my-subscriptions/posts', auth, async (req, res) => {
  try {
    const subs = await Subscription.find({ follower: req.userId }).populate('followed');
    
    const results = await Promise.all(subs.map(async (sub) => {
      const latestPost = await Post.findOne({ user: sub.followed._id }).sort({ createdAt: -1 });
      return {
        username: sub.followed.name || sub.followed.email,
        userId: sub.followed._id,
        latestPost: latestPost ? {
          title: latestPost.title,
          _id: latestPost._id
        } : null
      };
    }));

    res.json(results);
  } catch (err) {
    console.error('Помилка отримання підписок:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
