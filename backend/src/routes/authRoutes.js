const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { signupValidators, loginValidators } = require('../validators/authValidators');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/signup', validate(signupValidators), authController.signup);
router.post('/login', validate(loginValidators), authController.login);
router.get('/me', requireAuth, authController.me);
router.get('/me/memberships', requireAuth, authController.myMemberships);
router.patch('/me/preferences', requireAuth, authController.updatePreferences);
router.post('/me/resume', requireAuth, upload.single('resume'), authController.uploadResume);
router.post('/me/photo', requireAuth, upload.single('photo'), authController.uploadProfilePhoto);
router.get('/users', requireAuth, authController.listUsers);
router.get('/users/:id', requireAuth, authController.getUser);

module.exports = router;
