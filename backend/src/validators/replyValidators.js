const { body } = require('express-validator');

const createReplyValidators = [
  body('body').trim().notEmpty().withMessage('Body is required.'),
];

module.exports = {
  createReplyValidators,
};
