const User = require('../models/User');

//Lấy profile của người dùng
exports.getProfile = async (req, res) => {
    res.json(req.user);
};

//Cập nhật thông tin người dùng
exports.updateProfile = async (req, res) => {
    const { username, email } = req.body;
    try {
        const { avatar, bio } = req.body;
        req.user.avatar = avatar || req.user.avatar;
        req.user.bio = bio || req.user.bio;
        await req.user.save();
        res.json(req.user);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi server.' });
    }
};

//Tìm kiếm người dùng
exports.searchUsers = async (req, res) => {
    const { keyword } = req.query;
    try {
        if (!keyword) return res.status(400).json({ message: "Không hợp lệ." });

        const users = await User.find({
            $or: [
                { username: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } }
            ],
            _id: { $ne: req.user._id }
        }).select("-password");

        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi server.' });
    }
};

//Gửi lời mời kết bạn
exports.addFriend = async (req, res) => {
    try {
        const friendId = req.params.id;

        if (req.user.friends.includes(friendId)) {
            return res.status(400).json({ message: "Đã là bạn." });
        }

        const friend = await User.findById(friendId);
        if (!friend) return res.status(404).json({ message: "Không tìm thấy người này." });

        // Hai chiều
        req.user.friends.push(friend._id);
        friend.friends.push(req.user._id);

        await req.user.save();
        await friend.save();

        res.json({ message: "Friend added" });
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi server.' });
    }
};

// Xóa bạn
exports.removeFriend = async (req, res) => {
    try {
        const friendId = req.params.id;

        if (!req.user.friends.includes(friendId)) {
            return res.status(400).json({ message: "Không phải bạn." });
        }

        const friend = await User.findById(friendId);
        if (!friend) return res.status(404).json({ message: "Không tìm thấy người này." });

        // Hai chiều
        req.user.friends.pull(friend._id);
        friend.friends.pull(req.user._id);

        await req.user.save();
        await friend.save();

        res.json({ message: "Đã xoá" });
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi server.' });
    }
};

// Lấy danh sách bạn
exports.getFriends = async (req, res) => {
    try {
        const userWithFriends = await User.findById(req.user._id).populate("friends", "-password");
        res.json(userWithFriends.friends);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi server.' });
    }
};