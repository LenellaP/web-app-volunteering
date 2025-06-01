const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Request', RequestSchema);
