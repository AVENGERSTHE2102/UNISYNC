
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('UniSync Backend is running!');
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/mentorship', require('./routes/mentorshipRoutes'));
// app.use('/api/communities', require('./routes/communityRoutes'));
// app.use('/api/threads', require('./routes/threadRoutes'));
// app.use('/api/replies', require('./routes/replyRoutes'));
// app.use('/api/events', require('./routes/eventRoutes'));
// app.use('/api/jobs', require('./routes/jobRoutes'));
// app.use('/api/resources', require('./routes/resourceRoutes'));
// app.use('/api/chat', require('./routes/chatRoutes'));
// app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

// Error Handling Middleware
app.use(require('./middleware/errorHandler'));

module.exports = app;
