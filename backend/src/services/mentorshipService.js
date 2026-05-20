const { AppError } = require('../utils/appError');

function createMentorshipService({ mentorshipRepository, userRepository }) {
  return {
    async requestMentorship({ studentId, mentorId }) {
      if (Number(studentId) === Number(mentorId)) {
        throw new AppError('You cannot request a mentorship connection with yourself.', {
          statusCode: 400,
          code: 'INVALID_MENTORSHIP',
        });
      }

      // Check if relationship already exists
      const existing = await mentorshipRepository.findExisting(studentId, mentorId);
      if (existing) {
        throw new AppError('A mentorship request or connection already exists between you.', {
          statusCode: 400,
          code: 'DUPLICATE_MENTORSHIP',
        });
      }

      // Fetch student & mentor to calculate matching compatibility
      const student = await userRepository.findById(studentId);
      const mentor = await userRepository.findById(mentorId);

      if (!student) {
        throw new AppError('Student user not found.', {
          statusCode: 404,
          code: 'STUDENT_NOT_FOUND',
        });
      }
      if (!mentor) {
        throw new AppError('Mentor user not found.', {
          statusCode: 404,
          code: 'MENTOR_NOT_FOUND',
        });
      }

      // Ensure mentor has correct role
      if (mentor.role !== 'alumni' && mentor.role !== 'admin') {
        throw new AppError('Mentorship connections can only be requested with Alumni or Admins.', {
          statusCode: 400,
          code: 'INVALID_MENTOR_ROLE',
        });
      }

      // Calculate compatibility score
      let score = 50; // base score
      const studentInterests = student.interests || [];
      const mentorInterests = mentor.interests || [];

      if (studentInterests.length > 0 && mentorInterests.length > 0) {
        const matches = studentInterests.filter(interest => mentorInterests.includes(interest));
        const matchPercentage = matches.length / Math.max(studentInterests.length, mentorInterests.length);
        score += Math.round(matchPercentage * 40);
      }

      if (student.branch && mentor.branch && student.branch.toLowerCase() === mentor.branch.toLowerCase()) {
        score += 10;
      }

      // Normalize score between 0 and 100
      score = Math.min(100, Math.max(0, score));

      const request = await mentorshipRepository.createRequest({
        studentId,
        mentorId,
        compatibilityScore: score / 100.0, // float range [0, 1]
      });

      return request;
    },

    async listMentorships(userId) {
      const items = await mentorshipRepository.listUserMentorships(userId);
      return {
        items,
        meta: {
          count: items.length,
        },
      };
    },

    async updateRequestStatus({ requestId, userId, status }) {
      const request = await mentorshipRepository.findById(requestId);
      if (!request) {
        throw new AppError('Mentorship request not found.', {
          statusCode: 404,
          code: 'REQUEST_NOT_FOUND',
        });
      }

      // Only the mentor can change status (accept, decline, complete)
      if (Number(request.mentorId) !== Number(userId)) {
        throw new AppError('You are not authorized to update this mentorship request.', {
          statusCode: 403,
          code: 'UNAUTHORIZED_MENTOR',
        });
      }

      if (!['active', 'completed', 'declined'].includes(status)) {
        throw new AppError('Invalid status value.', {
          statusCode: 400,
          code: 'INVALID_STATUS',
        });
      }

      const updated = await mentorshipRepository.updateStatus(requestId, status);
      return updated;
    },

    async listPotentialMentors(userId, filters = {}) {
      const mentors = await userRepository.listMentors(filters);
      // Filter out the current user if they are alumni/admin
      const filtered = mentors.filter(m => Number(m.id) !== Number(userId));
      return {
        items: filtered,
        meta: {
          count: filtered.length,
        },
      };
    },
  };
}

module.exports = {
  createMentorshipService,
};
