const { createAuthService } = require('../services/authService');
const { createCommunityService } = require('../services/communityService');
const { createThreadService } = require('../services/threadService');
const { createReplyService } = require('../services/replyService');
const { createEventService } = require('../services/eventService');
const { createJobService } = require('../services/jobService');
const { createInMemoryRepositories } = require('./helpers/inMemoryRepositories');

describe('services', () => {
  test('auth service handles signup and login', async () => {
    const repositories = createInMemoryRepositories();
    const service = createAuthService({ userRepository: repositories.userRepository });

    const signup = await service.signup({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password1!',
      role: 'student',
      interests: ['ai-ml'],
    });

    expect(signup.user.email).toBe('test@example.com');
    expect(signup.token).toBeTruthy();

    const login = await service.login({
      email: 'test@example.com',
      password: 'Password1!',
    });

    expect(login.user.role).toBe('student');
  });

  test('community, thread, and reply services operate on normalized fields', async () => {
    const repositories = createInMemoryRepositories();
    const communityService = createCommunityService({
      communityRepository: repositories.communityRepository,
      chatRoomRepository: repositories.chatRoomRepository,
    });
    const threadService = createThreadService({
      threadRepository: repositories.threadRepository,
      communityService,
      membershipRepository: repositories.membershipRepository,
    });
    const replyService = createReplyService({
      replyRepository: repositories.replyRepository,
      threadService,
      membershipRepository: repositories.membershipRepository,
    });

    const actor = { id: 1, role: 'admin' };
    const community = await communityService.createCommunity(
      { name: 'Club', description: 'Desc', category: 'Tech' },
      actor
    );
    await repositories.membershipRepository.create({ communityId: community.id, userId: actor.id });
    const thread = await threadService.createThread(community.id, { title: 'Topic', body: 'Body' }, actor);
    const reply = await replyService.createReply(thread.id, { body: 'Reply body' }, actor);

    expect(thread.body).toBe('Body');
    expect(reply.body).toBe('Reply body');
  });

  test('event and job services preserve pagination-ready list behavior', async () => {
    const repositories = createInMemoryRepositories();
    const eventService = createEventService({ eventRepository: repositories.eventRepository });
    const jobService = createJobService({ jobRepository: repositories.jobRepository });
    const actor = { id: 7, role: 'admin' };

    await eventService.createEvent(
      {
        title: 'Launch',
        description: 'Desc',
        date: new Date().toISOString(),
        location: 'Campus',
        type: 'Workshop',
      },
      actor
    );
    await jobService.createJob(
      {
        title: 'Intern',
        company: 'UniSync',
        description: 'Desc',
        deadline: null,
        contactEmail: 'jobs@example.com',
        type: 'Internship',
        location: 'Remote',
      },
      actor
    );

    const events = await eventService.listEvents({});
    const jobs = await jobService.listJobs({});

    expect(events.meta.total).toBe(1);
    expect(jobs.meta.total).toBe(1);
  });
});
