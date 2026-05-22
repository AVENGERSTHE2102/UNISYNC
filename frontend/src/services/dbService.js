import { apiRequest } from './api';

// ─── Auth / User ─────────────────────────────────────────────────────────────

export async function getCurrentUser() {
  const response = await apiRequest('/api/auth/me', { auth: true });
  return response.data ?? null;
}

export async function getUserProfile(id) {
  const response = await apiRequest(`/api/auth/users/${id}`, { auth: true });
  return response.data ?? null;
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function createEvent(event) {
  const response = await apiRequest('/api/events', {
    method: 'POST',
    body: event,
    auth: true
  });
  return response.data;
}

export async function getEvents() {
  const response = await apiRequest('/api/events');
  return response.data ?? [];
}

export async function getMyTickets() {
  const response = await apiRequest('/api/events/tickets', { auth: true });
  return response.data ?? [];
}

export async function registerForEvent(eventId) {
  const response = await apiRequest(`/api/events/${eventId}/register`, {
    method: 'POST',
    auth: true
  });
  return response.data;
}

// ─── Mentorships ─────────────────────────────────────────────────────────────

export async function createMentorship(mentorship) {
  const response = await apiRequest('/api/mentorships', {
    method: 'POST',
    body: mentorship,
    auth: true
  });
  return response.data;
}

// List mentorships the logged-in user is part of (requires auth)
export async function getMentorships() {
  const response = await apiRequest('/api/mentorships', { auth: true });
  return response.data ?? [];
}

export async function updateMentorshipStatus(id, status) {
  const response = await apiRequest(`/api/mentorships/${id}`, {
    method: 'PATCH',
    body: { status },
    auth: true
  });
  return response.data;
}

// Browse all potential mentors (requires auth)
export async function getPotentialMentors(interest) {
  const params = interest ? `?interest=${encodeURIComponent(interest)}` : '';
  const response = await apiRequest(`/api/mentorships/mentors${params}`, { auth: true });
  return response.data ?? [];
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export async function createJob(job) {
  const response = await apiRequest('/api/jobs', {
    method: 'POST',
    body: job,
    auth: true
  });
  return response.data;
}

export async function getJobs() {
  const response = await apiRequest('/api/jobs');
  return response.data ?? [];
}

// ─── Communities ──────────────────────────────────────────────────────────────

export async function createCommunity(community) {
  const response = await apiRequest('/api/communities', {
    method: 'POST',
    body: community,
    auth: true
  });
  return response.data;
}

export async function getCommunities() {
  const response = await apiRequest('/api/communities');
  return response.data ?? [];
}

export async function getCommunityById(id) {
  const response = await apiRequest(`/api/communities/${id}`);
  return response.data ?? null;
}

export async function joinCommunity(communityId) {
  const response = await apiRequest(`/api/communities/${communityId}/memberships`, {
    method: 'POST',
    auth: true
  });
  return response.data;
}

export async function getMemberships() {
  const response = await apiRequest('/api/auth/me/memberships', { auth: true });
  return response.data ?? [];
}

// ─── Threads & Replies ────────────────────────────────────────────────────────

export async function getThreads(communityId) {
  const response = await apiRequest(`/api/communities/${communityId}/threads`);
  return response.data ?? [];
}

export async function createThread(communityId, thread) {
  const response = await apiRequest(`/api/communities/${communityId}/threads`, {
    method: 'POST',
    body: thread,
    auth: true
  });
  return response.data;
}

export async function getReplies(threadId) {
  const response = await apiRequest(`/api/threads/${threadId}/replies`);
  return response.data ?? [];
}

export async function createReply(threadId, reply) {
  const response = await apiRequest(`/api/threads/${threadId}/replies`, {
    method: 'POST',
    body: reply,
    auth: true
  });
  return response.data;
}

// ─── Connections ──────────────────────────────────────────────────────────────

export async function sendConnectionRequest(receiverId) {
  const response = await apiRequest('/api/connections', {
    method: 'POST',
    body: { receiverId },
    auth: true
  });
  return response.data;
}

export async function getConnections() {
  const response = await apiRequest('/api/connections', { auth: true });
  return response.data ?? [];
}

export async function updateConnectionStatus(connectionId, status) {
  const response = await apiRequest(`/api/connections/${connectionId}`, {
    method: 'PATCH',
    body: { status },
    auth: true
  });
  return response.data;
}

// ─── Chat Sockets Data ────────────────────────────────────────────────────────

export async function getChatRooms() {
  const response = await apiRequest('/api/chat/rooms', { auth: true });
  return response.data ?? [];
}

export async function getChatMessages(roomId) {
  const response = await apiRequest(`/api/chat/rooms/${roomId}/messages`, { auth: true });
  return response.data ?? [];
}

export async function markRoomAsRead(roomId) {
  const response = await apiRequest(`/api/chat/rooms/${roomId}/read`, {
    method: 'POST',
    auth: true
  });
  return response.data;
}

