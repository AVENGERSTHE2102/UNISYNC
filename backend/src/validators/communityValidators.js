const { body, param } = require('express-validator');

const createCommunityValidators = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('category').trim().notEmpty().withMessage('Category is required.'),
];

const communityIdValidators = [
  param('communityId').isInt({ min: 1 }).withMessage('communityId must be a positive integer.'),
];

module.exports = {
  createCommunityValidators,
  communityIdValidators,
};
