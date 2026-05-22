const { parsePagination } = require('../utils/pagination');

function createJobService({ jobRepository }) {
  return {
    async listJobs(query) {
      const pagination = parsePagination(query);
      const result = await jobRepository.list(pagination);

      return {
        items: result.rows,
        meta: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: result.count,
        },
      };
    },
    async createJob(payload, actor) {
      return jobRepository.create({
        createdBy: actor.id,
        title: payload.title,
        company: payload.company,
        description: payload.description,
        deadline: payload.deadline,
        contactEmail: payload.contactEmail,
        type: payload.type,
        location: payload.location,
      });
    },
    async saveJob(jobId, userId) {
      return jobRepository.saveJob(jobId, userId);
    },
    async unsaveJob(jobId, userId) {
      return jobRepository.unsaveJob(jobId, userId);
    },
    async getSavedJobs(userId) {
      return jobRepository.getSavedJobs(userId);
    },
    async applyForJob(jobId, userId) {
      return jobRepository.applyForJob(jobId, userId);
    },
    async getApplications(userId) {
      return jobRepository.getApplications(userId);
    }
  };
}

module.exports = {
  createJobService,
};
