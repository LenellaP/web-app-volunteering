const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controllers/postController'); 
const auth = require('../middleware/authMiddleware'); 
const { getMyPosts } = require('../controllers/postController');
const { updatePost, deletePost, getPostById, getPostsByUser } = require('../controllers/postController');
const postController = require('../controllers/postController');

router.get('/mine', auth, postController.getMyPosts);
router.get('/:id', auth, getPostById);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost); 
router.get('/user/:id', getPostsByUser); 
router.post('/', auth, createPost);
router.get('/', getPosts);

module.exports = router;
