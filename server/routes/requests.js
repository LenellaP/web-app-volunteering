const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getRequests, createRequest, getMyRequests, getRequestsByUser } = require('../controllers/requestController');
const requestController = require('../controllers/requestController');

router.get('/user/:id', requestController.getRequestsByUser);
router.post('/', auth, createRequest);
router.get('/', getRequests);
router.get('/mine', auth, getMyRequests);
router.get('/user/:id', getRequestsByUser);

module.exports = router;
