const Chat = require('../models/Chat');
const User = require('../models/User');

// Tạo chat riêng
exports.createPrivateChat = async (req, res) => {
    try {
        const { userId } = req.body;

        let chat = await Chat.findOne({
            isGroupChat: false,
            members: { $all: [req.user._id, userId] }
        }).populate('members', '-password');

        if (!chat) {
            chat = await Chat.create({
                members: [req.user._id, userId]
            });
            await chat.populate('members', '-password');
        }

        res.json(chat);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server." });
    }
};

// Tạo group chat
exports.createGroupChat = async (req, res) => {
    try {
        const { name, memberIds } = req.body;

        const chat = await Chat.create({
            name,
            isGroupChat: true,
            members: [req.user._id, ...memberIds]
        });

        await chat.populate('members', '-password');
        res.status(201).json(chat);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server." });
    }
};

// Lấy tất cả chat của user
exports.getUserChats = async (req, res) => {
    try {
        const chats = await Chat.find({ members: req.user._id })
            .populate('members', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 });

        res.json(chats);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server." });
    }
};
