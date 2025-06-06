const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar:   { type: String },
  bio:      { type: String },
  status:   { type: String, default: 'offline' }, // online | offline
  friends:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
