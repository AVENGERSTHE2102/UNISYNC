const { body, param } = require('express-validator');

const threadIdValidators = [
  param('threadId').isInt({ min: 1 }).withMessage('threadId must be a positive integer.'),
];

const createThreadValidators = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('body').trim().notEmpty().withMessage('Body is required.'),
];

module.exports = {
  threadIdValidators,
  createThreadValidators,
};
