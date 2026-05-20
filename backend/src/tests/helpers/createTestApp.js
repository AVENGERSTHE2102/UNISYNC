const { createApp } = require('../../app');
const { createAuthService } = require('../../services/authService');
const { createCommunityService } = require('../../services/communityService');
const { createThreadService } = require('../../services/threadService');
const { createReplyService } = require('../../services/replyService');
const { createEventService } = require('../../services/eventService');
const { createJobService } = require('../../services/jobService');
const { createMentorshipService } = require('../../services/mentorshipService');
const { createMessageService } = require('../../services/messageService');
const { createMembershipService } = require('../../services/membershipService');
const { createResourceService } = require('../../services/resourceService');
const { createInMemoryRepositories } = require('./inMemoryRepositories');

function buildTestServices() {
  const repositories = createInMemoryRepositories();
  const services = {};

  services.authService = createAuthService({
    userRepository: repositories.userRepository,
  });
  services.communityService = createCommunityService({
    communityRepository: repositories.communityRepository,
  });
  services.membershipService = createMembershipService({
    membershipRepository: repositories.membershipRepository,
    communityService: services.communityService,
  });
  services.threadService = createThreadService({
    threadRepository: repositories.threadRepository,
    communityService: services.communityService,
    membershipRepository: repositories.membershipRepository,
  });
  services.replyService = createReplyService({
    replyRepository: repositories.replyRepository,
    threadService: services.threadService,
    membershipRepository: repositories.membershipRepository,
  });
  services.eventService = createEventService({
    eventRepository: repositories.eventRepository,
  });
  services.jobService = createJobService({
    jobRepository: repositories.jobRepository,
  });
  services.mentorshipService = createMentorshipService({
    mentorshipRepository: repositories.mentorshipRepository,
    userRepository: repositories.userRepository,
  });
  services.messageService = createMessageService({
    messageRepository: repositories.messageRepository,
    chatRoomRepository: repositories.chatRoomRepository,
  });
  services.resourceService = createResourceService({
    resourceRepository: repositories.resourceRepository,
    membershipRepository: repositories.membershipRepository,
    communityService: services.communityService,
  });

  return {
    services,
    repositories,
  };
}

function createTestApp() {
  const { services, repositories } = buildTestServices();
  const app = createApp({ services, staticDir: null });

  return {
    app,
    services,
    repositories,
  };
}

module.exports = {
  createTestApp,
};
