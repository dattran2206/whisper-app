const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    isGroupChat: { type: Boolean, default: false },
    name: { type: String }, // tên nhóm (nếu là group)
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
