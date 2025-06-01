const Subscription = require('../models/Subscription');

// Підписка на користувача
exports.subscribeToUser = async (req, res) => {
  try {
    const subscriber = req.userId;
    const targetUser = req.params.id;

    if (subscriber === targetUser) {
      return res.status(400).json({ message: 'Не можна підписатися на себе' });
    }

    const existing = await Subscription.findOne({ subscriber, targetUser });
    if (existing) {
      return res.status(400).json({ message: 'Ви вже підписані' });
    }

    const newSubscription = new Subscription({ subscriber, targetUser });
    await newSubscription.save();

    res.status(201).json({ message: 'Підписка успішна' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка підписки' });
  }
};

// Перевірка підписки
exports.checkSubscription = async (req, res) => {
  try {
    const subscriber = req.userId;
    const targetUser = req.params.id;

    const subscription = await Subscription.findOne({ subscriber, targetUser });
    res.json({ subscribed: !!subscription });
  } catch (err) {
    res.status(500).json({ message: 'Помилка перевірки підписки' });
  }
};

// Отримати всі підписки користувача
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ subscriber: req.userId })
      .populate('targetUser', 'username email');
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: 'Помилка завантаження підписок' });
  }
};