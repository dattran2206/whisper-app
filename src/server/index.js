const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require('http');
const socketio = require('socket.io');
const socketHandler = require('./socket');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use('/api/friend-requests', require('./routes/friendRequestRoutes'));

// Tạo HTTP server riêng để gắn socket
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*", // hoặc cấu hình cụ thể frontend origin
        methods: ["GET", "POST"]
    }
});

socketHandler(io);

// Dùng server.listen thay vì app.listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
