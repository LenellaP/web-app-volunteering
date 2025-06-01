const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, postId, requestId, text } = req.body;

    const message = new Message({
      sender: req.userId,
      receiver: receiverId,
      post: postId || null,
      request: requestId || null,
      text
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error('Error sending message:', err.message);
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
};

exports.getMessagesByPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const messages = await Message.find({ post: postId })
      .sort({ createdAt: 1 })
      .populate('sender', 'username')
      .populate('receiver', 'username');

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).json({ message: 'Error fetching messages', error: err.message });
  }
};

exports.getMessagesByRequest = async (req, res) => {
  try {
    const messages = await Message.find({ request: req.params.id })
      .sort({ createdAt: 1 })
      .populate('sender', 'username')
      .populate('receiver', 'username');

    res.json(messages);
  } catch (err) {
    console.error('Error loading messages:', err.message);
    res.status(500).json({ message: 'Error loading messages', error: err.message });
  }
};
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.userId;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .sort({ updatedAt: -1 }) 
    .populate('sender', 'username')
    .populate('receiver', 'username');

    const chatsMap = new Map();
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
      const key = `${otherUser._id}_${msg.post || msg.requestId}`;
      if (!chatsMap.has(key)) {
        chatsMap.set(key, {
          participant: otherUser,
          lastMessage: msg.text,
          post: msg.post,
          request: msg.request,
          updatedAt: msg.updatedAt
        });
      }
    });

    res.json(Array.from(chatsMap.values()));
  } catch (err) {
    console.error('Error loading user chats:', err.message);
    res.status(500).json({ message: 'Error loading user chats', error: err.message });
  }
};