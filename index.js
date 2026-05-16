
const app = require('./src/server');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server);

// Socket.IO connection
require('./src/realtime/chatHandler')(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
