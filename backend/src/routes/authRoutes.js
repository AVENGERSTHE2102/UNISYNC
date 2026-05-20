const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { signupValidators, loginValidators } = require('../validators/authValidators');

const router = express.Router();

router.post('/signup', validate(signupValidators), authController.signup);
router.post('/login', validate(loginValidators), authController.login);
router.get('/me', requireAuth, authController.me);
router.get('/users', requireAuth, authController.listUsers);

module.exports = router;
