const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.getAllJobs = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.jobService.listJobs(req.query);

  sendSuccess(res, {
    data: result.items,
    meta: result.meta,
  });
});

exports.createJob = asyncHandler(async (req, res) => {
  const job = await req.app.locals.services.jobService.createJob(req.body, req.user);

  sendSuccess(res, {
    statusCode: 201,
    message: 'Job created successfully.',
    code: 'JOB_CREATED',
    data: job,
  });
});

exports.getSavedJobs = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.jobService.getSavedJobs(req.user.id);
  sendSuccess(res, { data: result });
});

exports.saveJob = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.jobService.saveJob(req.params.id, req.user.id);
  sendSuccess(res, { data: result, message: 'Job saved.' });
});

exports.unsaveJob = asyncHandler(async (req, res) => {
  await req.app.locals.services.jobService.unsaveJob(req.params.id, req.user.id);
  sendSuccess(res, { message: 'Job unsaved.' });
});

exports.getApplications = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.jobService.getApplications(req.user.id);
  sendSuccess(res, { data: result });
});

exports.applyForJob = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.jobService.applyForJob(req.params.id, req.user.id);
  sendSuccess(res, { data: result, message: 'Applied for job successfully.' });
});
