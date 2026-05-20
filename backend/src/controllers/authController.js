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

exports.listUsers = asyncHandler(async (req, res) => {
  const users = await req.app.locals.services.authService.listUsers();
  sendSuccess(res, {
    data: users,
  });
});
