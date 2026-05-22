const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { AppError } = require('../utils/appError');

exports.getAllMentorships = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.mentorshipService.listMentorships(req.user.id);

  sendSuccess(res, {
    data: result.items,
    meta: result.meta,
  });
});

exports.createMentorship = asyncHandler(async (req, res) => {
  const { mentorId } = req.body;

  if (!mentorId) {
    throw new AppError('mentorId is required.', {
      statusCode: 400,
      code: 'MENTOR_REQUIRED',
    });
  }

  const result = await req.app.locals.services.mentorshipService.requestMentorship({
    studentId: req.user.id,
    mentorId: Number(mentorId),
  });

  sendSuccess(res, {
    data: result,
    message: 'Mentorship connection request sent successfully.',
  });
});

exports.updateMentorshipStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new AppError('status is required.', {
      statusCode: 400,
      code: 'STATUS_REQUIRED',
    });
  }

  const result = await req.app.locals.services.mentorshipService.updateRequestStatus({
    requestId: Number(id),
    userId: req.user.id,
    status,
  });

  sendSuccess(res, {
    data: result,
    message: `Mentorship connection status updated to ${status}.`,
  });
});

exports.getPotentialMentors = asyncHandler(async (req, res) => {
  const { interest } = req.query;

  const result = await req.app.locals.services.mentorshipService.listPotentialMentors(req.user.id, {
    interest,
  });

  sendSuccess(res, {
    data: result.items,
    meta: result.meta,
  });
});

exports.createGoal = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.mentorshipService.createGoal(req.user.id, req.body);
  sendSuccess(res, {
    data: result,
    message: 'Mentorship goal created successfully.',
  });
});

exports.getGoals = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.mentorshipService.getGoals(req.user.id);
  sendSuccess(res, {
    data: result,
  });
});
