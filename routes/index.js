const router = require('express').Router();
const adminRoutes = require('./admin');
const employeeRoutes = require('./employees');

router.use('/api/v1/admin', adminRoutes);
router.use('/api/v1/employee', employeeRoutes);

module.exports = router;
