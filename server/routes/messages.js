const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const {
  sendMessage,
  getMessagesByPost,
  getMessagesByRequest,
    getUserChats 
} = require('../controllers/messageController');

router.get('/request/:id', auth, getMessagesByRequest);
router.get('/:postId', auth, getMessagesByPost);
router.post('/', auth, sendMessage);
router.get('/my-chats', auth, getUserChats);


module.exports = router;
