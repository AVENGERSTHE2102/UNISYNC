const { body } = require('express-validator');

const allowedRoles = ['student', 'alumni', 'admin'];

const signupValidators = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.'),
  body('role').isIn(allowedRoles).withMessage('Role must be student, alumni, or admin.'),
  body('yearOfStudy').optional({ nullable: true }).isInt({ min: 1, max: 8 }),
  body('branch').optional({ nullable: true }).isString().trim(),
  body('company').optional({ nullable: true }).isString().trim(),
  body('professionalRole').optional({ nullable: true }).isString().trim(),
  body('interests').optional().isArray().withMessage('Interests must be an array.'),
];

const loginValidators = [
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

module.exports = {
  signupValidators,
  loginValidators,
};
