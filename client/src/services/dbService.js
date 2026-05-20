import { apiRequest } from './api';

export function syncLoginProfile({ email, firebaseToken }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: {
      email,
      firebaseToken
    }
  });
}

export function syncSignupProfile(profile) {
  return apiRequest('/api/auth/signup', {
    method: 'POST',
    body: profile
  });
}

export function createEvent(event) {
  return apiRequest('/api/events', {
    method: 'POST',
    body: event,
    auth: true
  });
}

export function getEvents() {
  return apiRequest('/api/events');
}

export function createMentorship(mentorship) {
  return apiRequest('/api/mentorships', {
    method: 'POST',
    body: mentorship
  });
}

export function getMentorships() {
  return apiRequest('/api/mentorships');
}

export function createJob(job) {
  return apiRequest('/api/jobs', {
    method: 'POST',
    body: job,
    auth: true
  });
}

export function getJobs() {
  return apiRequest('/api/jobs');
}

export function createCommunity(community) {
  return apiRequest('/api/communities', {
    method: 'POST',
    body: community,
    auth: true
  });
}

export function getCommunities() {
  return apiRequest('/api/communities');
}

export function getThreads(communityId) {
  return apiRequest(`/api/communities/${communityId}/threads`);
}

export function createThread(communityId, thread) {
  return apiRequest(`/api/communities/${communityId}/threads`, {
    method: 'POST',
    body: thread,
    auth: true
  });
}

export function getReplies(threadId) {
  return apiRequest(`/api/threads/${threadId}/replies`);
}

export function createReply(threadId, reply) {
  return apiRequest(`/api/threads/${threadId}/replies`, {
    method: 'POST',
    body: reply,
    auth: true
  });
}
