const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Gửi tin nhắn
exports.sendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;

        const message = await Message.create({
            chat: chatId,
            sender: req.user._id,
            content
        });

        await message.populate('sender', '-password');
        await message.populate('chat');

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

        res.status(201).json(message);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server." });
    }
};

// Lấy tin nhắn trong chat
exports.getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const messages = await Message.find({ chat: chatId })
            .populate('sender', '-password')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server." });
    }
};
