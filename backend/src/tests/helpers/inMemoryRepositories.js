function createInMemoryRepositories() {
  const state = {
    users: [],
    communities: [],
    threads: [],
    replies: [],
    events: [],
    jobs: [],
    chatRooms: [],
    messages: [],
    mentorships: [],
    memberships: [],
    resources: [],
  };

  const ids = {
    users: 1,
    communities: 1,
    threads: 1,
    replies: 1,
    events: 1,
    jobs: 1,
    chatRooms: 1,
    messages: 1,
    mentorships: 1,
    resources: 1,
  };

  function createListResult(items, { limit, offset }) {
    const rows = items.slice(offset, offset + limit);
    return {
      count: items.length,
      rows,
    };
  }

  return {
    state,
    userRepository: {
      async create(payload) {
        const user = { id: ids.users++, ...payload };
        state.users.push(user);
        return user;
      },
      async findByEmail(email) {
        return state.users.find((user) => user.email === email) || null;
      },
      async findById(id) {
        return state.users.find((user) => user.id === Number(id)) || null;
      },
      async listAll() {
        return state.users;
      },
      async listMentors(filters = {}) {
        return state.users.filter((u) => {
          const isMentorRole = u.role === 'alumni' || u.role === 'admin';
          if (!isMentorRole) return false;
          if (filters.interest) {
            const interests = u.interests || [];
            return interests.includes(filters.interest);
          }
          return true;
        });
      },
    },
    communityRepository: {
      async list(pagination) {
        return createListResult([...state.communities].reverse(), pagination);
      },
      async create(payload) {
        const community = { id: ids.communities++, ...payload, createdAt: new Date().toISOString() };
        state.communities.push(community);
        return community;
      },
      async findById(id) {
        return state.communities.find((community) => community.id === Number(id)) || null;
      },
    },
    threadRepository: {
      async listByCommunityId(communityId, pagination) {
        const filtered = state.threads.filter((thread) => thread.communityId === Number(communityId)).reverse();
        return createListResult(filtered, pagination);
      },
      async create(payload) {
        const thread = { id: ids.threads++, ...payload, createdAt: new Date().toISOString() };
        state.threads.push(thread);
        return thread;
      },
      async findById(id) {
        return state.threads.find((thread) => thread.id === Number(id)) || null;
      },
    },
    replyRepository: {
      async listByThreadId(threadId, pagination) {
        const filtered = state.replies.filter((reply) => reply.threadId === Number(threadId));
        return createListResult(filtered, pagination);
      },
      async create(payload) {
        const reply = { id: ids.replies++, ...payload, createdAt: new Date().toISOString() };
        state.replies.push(reply);
        return reply;
      },
    },
    eventRepository: {
      async list(pagination) {
        const sorted = [...state.events].sort((a, b) => new Date(a.date) - new Date(b.date));
        return createListResult(sorted, pagination);
      },
      async create(payload) {
        const event = { id: ids.events++, ...payload };
        state.events.push(event);
        return event;
      },
    },
    jobRepository: {
      async list(pagination) {
        return createListResult([...state.jobs].reverse(), pagination);
      },
      async create(payload) {
        const job = { id: ids.jobs++, ...payload };
        state.jobs.push(job);
        return job;
      },
    },
    mentorshipRepository: {
      async createRequest({ studentId, mentorId, compatibilityScore = 0 }) {
        const req = {
          id: ids.mentorships++,
          studentId: Number(studentId),
          mentorId: Number(mentorId),
          compatibilityScore,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.mentorships.push(req);
        return this.findById(req.id);
      },
      async findById(id) {
        const req = state.mentorships.find((m) => m.id === Number(id));
        if (!req) return null;
        const student = state.users.find((u) => u.id === req.studentId) || { id: req.studentId };
        const mentor = state.users.find((u) => u.id === req.mentorId) || { id: req.mentorId };
        return {
          ...req,
          student,
          mentor,
        };
      },
      async findExisting(studentId, mentorId) {
        return (
          state.mentorships.find(
            (m) => m.studentId === Number(studentId) && m.mentorId === Number(mentorId)
          ) || null
        );
      },
      async listUserMentorships(userId) {
        const list = state.mentorships.filter(
          (m) => m.studentId === Number(userId) || m.mentorId === Number(userId)
        );
        const enriched = list.map((req) => {
          const student = state.users.find((u) => u.id === req.studentId) || { id: req.studentId };
          const mentor = state.users.find((u) => u.id === req.mentorId) || { id: req.mentorId };
          return {
            ...req,
            student,
            mentor,
          };
        });
        return enriched.reverse();
      },
      async updateStatus(id, status) {
        const req = state.mentorships.find((m) => m.id === Number(id));
        if (!req) return null;
        req.status = status;
        req.updatedAt = new Date().toISOString();
        return this.findById(id);
      },
    },
    chatRoomRepository: {
      async findById(id) {
        return state.chatRooms.find((r) => r.id === Number(id)) || null;
      },
      async listUserRooms(userId) {
        return state.chatRooms.filter((r) => r.participantIds.includes(Number(userId)));
      },
      async hasMember(roomId, userId) {
        const room = state.chatRooms.find((r) => r.id === Number(roomId));
        return room ? room.participantIds.includes(Number(userId)) : false;
      },
      async createRoom(payload) {
        const participants = payload.participantIds.map((id) => {
          const u = state.users.find((user) => user.id === Number(id));
          return u ? { id: u.id, name: u.name } : { id };
        });
        const room = {
          id: ids.chatRooms++,
          name: payload.name || null,
          isGroup: payload.isGroup || false,
          participantIds: payload.participantIds,
          participants,
          createdAt: new Date().toISOString(),
        };
        state.chatRooms.push(room);
        return room;
      },
      async findDirectRoom(userId1, userId2) {
        return (
          state.chatRooms.find(
            (r) =>
              !r.isGroup &&
              r.participantIds.includes(Number(userId1)) &&
              r.participantIds.includes(Number(userId2))
          ) || null
        );
      },
    },
    messageRepository: {
      async create({ roomId, senderId, content }) {
        const sender = state.users.find((u) => u.id === Number(senderId)) || {
          id: senderId,
          name: 'User',
        };
        const msg = {
          id: ids.messages++,
          roomId: Number(roomId),
          senderId: Number(senderId),
          content,
          sender: { id: sender.id, name: sender.name },
          createdAt: new Date().toISOString(),
        };
        state.messages.push(msg);
        return msg;
      },
      async listByRoom(roomId, { limit = 50, offset = 0 } = {}) {
        const filtered = state.messages.filter((m) => m.roomId === Number(roomId));
        return createListResult(filtered, { limit, offset });
      },
    },
    membershipRepository: {
      async create({ communityId, userId }) {
        const membership = {
          communityId: Number(communityId),
          userId: Number(userId),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.memberships.push(membership);
        return membership;
      },
      async delete({ communityId, userId }) {
        state.memberships = state.memberships.filter(
          (m) => !(m.communityId === Number(communityId) && m.userId === Number(userId))
        );
        return 1;
      },
      async isMember(communityId, userId) {
        return state.memberships.some(
          (m) => m.communityId === Number(communityId) && m.userId === Number(userId)
        );
      },
      async listMembers(communityId) {
        const list = state.memberships.filter((m) => m.communityId === Number(communityId));
        return list.map((m) => {
          const user = state.users.find((u) => u.id === m.userId) || { id: m.userId };
          return {
            ...m,
            User: user,
          };
        });
      },
    },
    resourceRepository: {
      async create(payload) {
        const resource = {
          id: ids.resources++,
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.resources.push(resource);
        return resource;
      },
      async listByCommunityId(communityId) {
        return state.resources.filter((r) => r.communityId === Number(communityId)).reverse();
      },
      async findById(id) {
        return state.resources.find((r) => r.id === Number(id)) || null;
      },
    },
  };
}

module.exports = {
  createInMemoryRepositories,
};
