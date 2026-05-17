
const app = require('./src/server');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server);

// Socket.IO connection 
// require('./src/realtime/chatHandler')(io);

const db = require('./src/models');
const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to the database. Make sure PostgreSQL is running and .env is configured correctly.");
  console.error(err);
});
