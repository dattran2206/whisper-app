const jwt = require('jsonwebtoken');

// Giả sử bạn lưu userId vào JWT khi đăng nhập
module.exports = (io) => {
    const connectedUsers = new Map(); // userId -> socket.id

    io.on('connection', (socket) => {
        console.log('⚡ Socket connected:', socket.id);

        // Nhận token khi kết nối
        socket.on('authenticate', (token) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const userId = decoded.id;

                socket.userId = userId;
                connectedUsers.set(userId, socket.id);

                console.log(`✅ Authenticated user: ${userId}`);
                // Gửi status online cho bạn bè (nếu muốn)
            } catch (err) {
                console.log('❌ Invalid token');
                socket.disconnect();
            }
        });

        socket.on('join-chat', (chatId) => {
            if (!socket.userId) return;
            socket.join(chatId);
        });

        socket.on('send-message', (message) => {
            if (!socket.userId) return;

            const { chat, content, sender } = message;

            // Emit về room
            io.to(chat).emit('receive-message', {
                chat,
                content,
                sender,
                timestamp: new Date()
            });
        });

        socket.on('disconnect', () => {
            if (socket.userId) {
                connectedUsers.delete(socket.userId);
                console.log(`❌ User ${socket.userId} disconnected`);
                // Có thể emit về cho bạn bè biết user này offline
            }
        });
    });
};