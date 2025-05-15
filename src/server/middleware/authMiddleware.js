const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Chưa xác thực' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) return res.status(401).json({ message: "Không tìm thấy user" });

        next();
    } catch {
        res.status(401).json({ msg: 'Token không hợp lệ' });
    }
};

module.exports = auth;
