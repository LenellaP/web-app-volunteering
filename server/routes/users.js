const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const {
  getUserProfileData,
  subscribeToUser,
  getSubscriptions
} = require('../controllers/userController');


// Перегляд профілю іншого користувача
router.get('/profile/:id', getUserProfileData);

// Підписка
router.post('/subscribe/:id', auth, subscribeToUser);

// Отримати список підписок користувача 
router.get('/subscriptions', auth, getSubscriptions);

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('username email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
