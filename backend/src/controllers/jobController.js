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
