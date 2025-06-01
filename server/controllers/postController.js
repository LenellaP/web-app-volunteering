const Post = require('../models/Post');

// Створення поста
exports.createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const post = new Post({ title, description, user: req.userId });
    await post.save();

    const Subscription = require('../models/Subscription');
    const subscriptions = await Subscription.find({ followed: req.userId }).populate('follower');

    const io = req.app.get('io'); 
    subscriptions.forEach(sub => {
      const followerId = sub.follower._id.toString();
      io.to(followerId).emit('newPostNotification', {
        userId: req.userId,
        message: 'Користувач, на якого ви підписані, створив нове оголошення'
      });
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Error creating post' });
  }
};


// Отримання всіх постів
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username'); 
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId });
    res.json(posts);
  } catch (err) {
    console.error(' Помилка при отриманні постів користувача:', err);
    res.status(500).json({ message: 'Error fetching your posts' });
  }
};

exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні постів користувача' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.user.toString() !== req.userId)
      return res.status(403).json({ message: 'Access denied' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error loading post' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.user.toString() !== req.userId)
      return res.status(403).json({ message: 'Access denied' });

    post.title = req.body.title;
    post.description = req.body.description;
    post.category = req.body.category;

    await post.save();
    res.json({ message: 'Post updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.user.toString() !== req.userId)
      return res.status(403).json({ message: 'Access denied' });

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post' });
  }
};
