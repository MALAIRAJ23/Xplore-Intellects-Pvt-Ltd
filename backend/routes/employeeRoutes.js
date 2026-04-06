const express = require('express');
const { body, param } = require('express-validator');
const { getMyTasks, updateMyTaskStatus } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/errorMiddleware');

const router = express.Router();

router.use(protect, authorize('employee'));

router.get('/tasks', getMyTasks);

router.patch(
  '/tasks/:taskId/status',
  [
    param('taskId').isMongoId().withMessage('Valid task ID is required'),
    body('status')
      .isIn(['Pending', 'In Progress', 'Completed'])
      .withMessage('Status must be Pending, In Progress, or Completed')
  ],
  validateRequest,
  updateMyTaskStatus
);

module.exports = router;
