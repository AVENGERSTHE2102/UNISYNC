const express = require('express');
const authRoutes = require('./authRoutes');
const communityRoutes = require('./communityRoutes');
const threadRoutes = require('./threadRoutes');
const replyRoutes = require('./replyRoutes');
const eventRoutes = require('./eventRoutes');
const jobRoutes = require('./jobRoutes');
const mentorshipRoutes = require('./mentorshipRoutes');
const chatRoutes = require('./chatRoutes');
const connectionRoutes = require('./connectionRoutes');
const { sendSuccess } = require('../utils/apiResponse');

function createApiRouter() {
  const router = express.Router();

  router.get('/health', (req, res) =>
    sendSuccess(res, {
      data: {
        status: 'ok',
      },
      message: 'API healthy.',
    })
  );

  router.use('/auth', authRoutes);
  router.use('/communities', communityRoutes);
  router.use('/communities/:communityId/threads', threadRoutes);
  router.use('/threads/:threadId/replies', replyRoutes);
  router.use('/events', eventRoutes);
  router.use('/jobs', jobRoutes);
  router.use('/mentorships', mentorshipRoutes);
  router.use('/chat', chatRoutes);
  router.use('/connections', connectionRoutes);

  return router;
}

module.exports = createApiRouter;
