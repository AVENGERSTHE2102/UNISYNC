function toPlain(record) {
  return record ? record.get({ plain: true }) : null;
}

function createJobRepository({ Job, SavedJob, JobApplication }) {
  return {
    async list({ limit, offset }) {
      const result = await Job.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      return {
        count: result.count,
        rows: result.rows.map(toPlain),
      };
    },
    async create(payload) {
      return toPlain(await Job.create(payload));
    },
    async saveJob(jobId, userId) {
      const existing = await SavedJob.findOne({ where: { jobId, userId } });
      if (existing) return toPlain(existing);
      return toPlain(await SavedJob.create({ jobId, userId }));
    },
    async unsaveJob(jobId, userId) {
      await SavedJob.destroy({ where: { jobId, userId } });
    },
    async getSavedJobs(userId) {
      const saved = await SavedJob.findAll({
        where: { userId },
        include: [{ model: Job }]
      });
      return saved.map(toPlain);
    },
    async applyForJob(jobId, userId) {
      const existing = await JobApplication.findOne({ where: { jobId, userId } });
      if (existing) return toPlain(existing);
      return toPlain(await JobApplication.create({ jobId, userId }));
    },
    async getApplications(userId) {
      const apps = await JobApplication.findAll({
        where: { userId },
        include: [{ model: Job }]
      });
      return apps.map(toPlain);
    }
  };
}

module.exports = {
  createJobRepository,
};
