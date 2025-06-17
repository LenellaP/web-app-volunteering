const Post = require('../models/Post');
const Request = require('../models/Request');
const Subscription = require('../models/Subscription');

exports.getUserProfileData = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ user: userId });
     const requests = await Request.find({ user: userId });;
    res.json({ posts, requests });
  } catch (err) {
    res.status(500).json({ error: 'Помилка завантаження профілю' });
  }
};

exports.subscribeToUser = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      subscriber: req.userId,
      targetUser: req.params.id
    });

    if (subscription) {
      return res.status(400).json({ message: 'Ви вже підписані на цього користувача' });
    }

    const newSub = new Subscription({
      subscriber: req.userId,
      targetUser: req.params.id
    });

    await newSub.save();
    res.status(201).json({ message: 'Підписка оформлена' });
  } catch (err) {
    res.status(500).json({ error: 'Помилка підписки' });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({ subscriber: req.userId }).populate('targetUser', 'username');
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: 'Помилка завантаження підписок' });
  }
};
