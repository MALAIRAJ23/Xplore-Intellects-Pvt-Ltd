const User = require('../models/User');
const Task = require('../models/Task');

const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    next(error);
  }
};

const updateEmployeeStatus = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const employee = await User.findOne({ _id: employeeId, role: 'employee' });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.status = status;
    await employee.save();

    res.json({ message: `Employee ${status} successfully`, employee });
  } catch (error) {
    next(error);
  }
};

const assignTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, deadline } = req.body;

    const employee = await User.findOne({
      _id: assignedTo,
      role: 'employee',
      status: 'approved'
    });

    if (!employee) {
      return res.status(404).json({
        message: 'Approved employee not found for assignment'
      });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      deadline,
      status: 'Pending'
    });

    res.status(201).json({ message: 'Task assigned successfully', task });
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email status')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEmployees,
  updateEmployeeStatus,
  assignTask,
  getAllTasks
};
