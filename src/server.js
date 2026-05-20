const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const jobRoutes = require('./routes/jobRoutes');
const communityRoutes = require('./routes/communityRoutes');
const threadRoutes = require('./routes/threadRoutes');
const replyRoutes = require('./routes/replyRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/mentorships', mentorshipRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/communities/:communityId/threads', threadRoutes);
app.use('/api/threads/:threadId/replies', replyRoutes);

module.exports = app;