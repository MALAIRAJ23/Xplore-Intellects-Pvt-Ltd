const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@taskms.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const adminName = process.env.ADMIN_NAME || 'System Admin';

  const existingAdmin = await User.findOne({ email: adminEmail, role: 'admin' });
  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.create({
    name: adminName,
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
    status: 'approved'
  });

  console.log('Default admin created:', adminEmail);
};

module.exports = seedDefaultAdmin;
