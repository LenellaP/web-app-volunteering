const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  followed: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
