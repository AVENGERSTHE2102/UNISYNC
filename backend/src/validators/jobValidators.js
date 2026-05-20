const { body } = require('express-validator');

const createJobValidators = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('company').trim().notEmpty().withMessage('Company is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('deadline').optional({ nullable: true }).isISO8601().withMessage('Deadline must be a valid ISO date.'),
  body('contactEmail').isEmail().withMessage('A valid contactEmail is required.'),
  body('type').trim().notEmpty().withMessage('Type is required.'),
  body('location').optional({ nullable: true }).isString().trim(),
];

module.exports = {
  createJobValidators,
};
