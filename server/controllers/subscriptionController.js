const Subscription = require('../models/Subscription');

// Підписка на користувача
exports.subscribeToUser = async (req, res) => {
  try {
    const follower = req.userId;
    const followed = req.params.id;

    if (follower === followed) {
      return res.status(400).json({ message: 'Не можна підписатися на себе' });
    }

    const existing = await Subscription.findOne({ follower, followed });
    if (existing) {
      return res.status(400).json({ message: 'Ви вже підписані' });
    }

    const newSubscription = new Subscription({ follower, followed });
    await newSubscription.save();

    res.status(201).json({ message: 'Підписка успішна' });
  } catch (err) {
    console.error('Помилка підписки:', err);
    res.status(500).json({ message: 'Помилка підписки' });
  }
};

// Перевірка підписки
exports.checkSubscription = async (req, res) => {
  try {
    const follower = req.userId;
    const followed = req.params.id;

    const subscription = await Subscription.findOne({ follower, followed });
    res.json({ subscribed: !!subscription });
  } catch (err) {
    console.error('Помилка перевірки підписки:', err);
    res.status(500).json({ message: 'Помилка перевірки підписки' });
  }
};

// Отримати всі підписки користувача
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ follower: req.userId })
      .populate('followed', 'username email');
    res.json(subscriptions);
  } catch (err) {
    console.error('Помилка завантаження підписок:', err);
    res.status(500).json({ message: 'Помилка завантаження підписок' });
  }
};
