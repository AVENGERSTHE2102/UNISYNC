const { body } = require('express-validator');

const createEventValidators = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('date').isISO8601().withMessage('A valid ISO date is required.'),
  body('location').trim().notEmpty().withMessage('Location is required.'),
  body('type').trim().notEmpty().withMessage('Type is required.'),
];

module.exports = {
  createEventValidators,
};
