const express = require('express');
const { body, param } = require('express-validator');
const {
  getAllEmployees,
  updateEmployeeStatus,
  assignTask,
  getAllTasks
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/errorMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/employees', getAllEmployees);

router.patch(
  '/employees/:employeeId/status',
  [
    param('employeeId').isMongoId().withMessage('Valid employee ID is required'),
    body('status')
      .isIn(['approved', 'rejected'])
      .withMessage('Status must be approved or rejected')
  ],
  validateRequest,
  updateEmployeeStatus
);

router.post(
  '/tasks',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('assignedTo').isMongoId().withMessage('Valid employee ID is required'),
    body('deadline').isISO8601().withMessage('Valid deadline is required')
  ],
  validateRequest,
  assignTask
);

router.get('/tasks', getAllTasks);

module.exports = router;
