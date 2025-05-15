const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

// Gửi yêu cầu kết bạn
exports.sendRequest = async (req, res) => {
    try {
        const { id: to } = req.params;

        if (to === req.user._id.toString()) return res.status(400).json({ message: "Không thể gửi yêu cầu kết bạn cho chính bạn." });

        const exists = await FriendRequest.findOne({ from: req.user._id, to });
        if (exists) return res.status(400).json({ message: "Yêu cầu đã được gửi." });

        const newRequest = await FriendRequest.create({ from: req.user._id, to });
        res.status(201).json(newRequest);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server." });
    }
};

// Hủy yêu cầu đã gửi
exports.cancelRequest = async (req, res) => {
    try {
        const { id: to } = req.params;
        await FriendRequest.findOneAndDelete({ from: req.user._id, to, status: 'pending' });
        res.json({ message: "Đã huỷ yêu cầu kết bạn." });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server." });
    }
};

// Chấp nhận lời mời
exports.acceptRequest = async (req, res) => {
    try {
        const { id: from } = req.params;
        const request = await FriendRequest.findOne({ from, to: req.user._id, status: 'pending' });

        if (!request) return res.status(404).json({ message: "Không có yêu cầu." });

        request.status = 'accepted';
        await request.save();

        // Kết bạn 2 chiều
        const fromUser = await User.findById(from);
        req.user.friends.push(fromUser._id);
        fromUser.friends.push(req.user._id);
        await req.user.save();
        await fromUser.save();

        res.json({ message: "Yêu cầu đã được chấp nhận." });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server." });
    }
};

// Từ chối lời mời
exports.declineRequest = async (req, res) => {
    try {
        const { id: from } = req.params;
        const request = await FriendRequest.findOne({ from, to: req.user._id, status: 'pending' });

        if (!request) return res.status(404).json({ message: "Không có yêu cầu." });

        request.status = 'declined';
        await request.save();

        res.json({ message: "Yêu cầu đã bị từ chối." });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server." });
    }
};

// Xem lời mời đã nhận
exports.getReceivedRequests = async (req, res) => {
    try {
        const requests = await FriendRequest.find({ to: req.user._id, status: 'pending' }).populate('from', '-password');
        res.json(requests);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server." });
    }
};

// Xem lời mời đã gửi
exports.getSentRequests = async (req, res) => {
    try {
        const requests = await FriendRequest.find({ from: req.user._id, status: 'pending' }).populate('to', '-password');
        res.json(requests);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server." });
    }
};
