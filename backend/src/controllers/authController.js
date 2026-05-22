const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.signup = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.authService.signup(req.body);

  sendSuccess(res, {
    statusCode: 201,
    message: 'User created successfully.',
    code: 'USER_CREATED',
    data: result,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.authService.login(req.body);

  sendSuccess(res, {
    message: 'Login successful.',
    code: 'LOGIN_SUCCESS',
    data: result,
  });
});

exports.me = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    data: req.user,
  });
});

exports.myMemberships = asyncHandler(async (req, res) => {
  const memberships = await req.app.locals.services.membershipService.listUserMemberships(req.user.id);
  sendSuccess(res, {
    data: memberships,
  });
});

exports.listUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user ? req.user.id : null;
  const users = await req.app.locals.services.authService.listUsers(currentUserId);
  sendSuccess(res, {
    data: users,
  });
});

exports.getUser = asyncHandler(async (req, res) => {
  const currentUserId = req.user ? req.user.id : null;
  const userId = req.params.id;
  const user = await req.app.locals.services.authService.getUserProfile(userId, currentUserId);
  sendSuccess(res, {
    data: user,
  });
});

exports.updatePreferences = asyncHandler(async (req, res) => {
  const result = await req.app.locals.services.authService.updatePreferences(req.user.id, req.body);
  sendSuccess(res, {
    message: 'Preferences updated successfully.',
    data: result,
  });
});

exports.uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No resume file provided' });
  }
  const result = await req.app.locals.services.authService.updateResumeUrl(req.user.id, `/uploads/${req.file.filename}`);
  sendSuccess(res, {
    message: 'Resume uploaded successfully.',
    data: result,
  });
});

exports.uploadProfilePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No photo file provided' });
  }
  const result = await req.app.locals.services.authService.updateProfilePhoto(req.user.id, `/uploads/${req.file.filename}`);
  sendSuccess(res, {
    message: 'Profile photo uploaded successfully.',
    data: result,
  });
});
