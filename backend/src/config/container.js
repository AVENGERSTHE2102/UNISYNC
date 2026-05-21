const { createSequelizeInstance } = require('./database');
const { initModels } = require('../models');
const { createUserRepository } = require('../repositories/userRepository');
const { createCommunityRepository } = require('../repositories/communityRepository');
const { createThreadRepository } = require('../repositories/threadRepository');
const { createReplyRepository } = require('../repositories/replyRepository');
const { createEventRepository } = require('../repositories/eventRepository');
const { createJobRepository } = require('../repositories/jobRepository');
const { createChatRoomRepository } = require('../repositories/chatRoomRepository');
const { createMessageRepository } = require('../repositories/messageRepository');
const { createMentorshipRepository } = require('../repositories/mentorshipRepository');
const { createMembershipRepository } = require('../repositories/membershipRepository');
const { createResourceRepository } = require('../repositories/resourceRepository');
const { createConnectionRepository } = require('../repositories/connectionRepository');
const { createAuthService } = require('../services/authService');
const { createCommunityService } = require('../services/communityService');
const { createThreadService } = require('../services/threadService');
const { createReplyService } = require('../services/replyService');
const { createEventService } = require('../services/eventService');
const { createJobService } = require('../services/jobService');
const { createMentorshipService } = require('../services/mentorshipService');
const { createMessageService } = require('../services/messageService');
const { createMembershipService } = require('../services/membershipService');
const { createResourceService } = require('../services/resourceService');
const { createConnectionService } = require('../services/connectionService');

function createRuntimeContainer() {
  const sequelize = createSequelizeInstance();
  const models = initModels(sequelize);

  const repositories = {
    userRepository: createUserRepository(models),
    communityRepository: createCommunityRepository(models),
    threadRepository: createThreadRepository(models),
    replyRepository: createReplyRepository(models),
    eventRepository: createEventRepository(models),
    jobRepository: createJobRepository(models),
    chatRoomRepository: createChatRoomRepository(models),
    messageRepository: createMessageRepository(models),
    mentorshipRepository: createMentorshipRepository(models),
    membershipRepository: createMembershipRepository(models),
    resourceRepository: createResourceRepository(models),
    connectionRepository: createConnectionRepository(models),
  };

  const services = {};

  services.authService = createAuthService(repositories);
  services.communityService = createCommunityService(repositories);
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
  services.eventService = createEventService(repositories);
  services.jobService = createJobService(repositories);
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
  services.connectionService = createConnectionService({
    connectionRepository: repositories.connectionRepository,
    userRepository: repositories.userRepository,
    chatRoomRepository: repositories.chatRoomRepository,
  });

  return {
    sequelize,
    models,
    repositories,
    services,
  };
}

module.exports = {
  createRuntimeContainer,
};
