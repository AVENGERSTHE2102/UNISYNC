const express = require('express');
const jobController = require('../controllers/jobController');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { createJobValidators } = require('../validators/jobValidators');

const router = express.Router();

router.get('/', jobController.getAllJobs);
router.post(
  '/',
  requireAuth,
  authorize('admin'),
  validate(createJobValidators),
  jobController.createJob
);

router.get('/saved', requireAuth, jobController.getSavedJobs);
router.post('/:id/save', requireAuth, jobController.saveJob);
router.delete('/:id/save', requireAuth, jobController.unsaveJob);

router.get('/applications', requireAuth, jobController.getApplications);
router.post('/:id/apply', requireAuth, jobController.applyForJob);

module.exports = router;
