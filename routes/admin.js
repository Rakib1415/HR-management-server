const router = require('express').Router();
const adminController = require('../controllers/admin');
const authenticate = require('../middlewares/authenticate');

router.post('/auth/register', adminController.register);
router.post('/auth/login', adminController.login);

router.post('/employees', authenticate, adminController.createEmployee);

router.get('/employees', authenticate, adminController.getAllEmployee);

router.get('/employees/:id', authenticate, adminController.getEmployeeById);

router.put('/employees/:id', authenticate, adminController.updateEmployee);

router.delete('/employees/:id', authenticate, adminController.deleteEmployeeById);

router.get('/absence-requests', authenticate, adminController.getAllAbsenceRequest);

router.get('/absence-requests/:id', (req, res) => {
    res.send('get one absence-requests route!');
});

router.get('/absence-statuses/:id/approve', authenticate, adminController.approveAbsenceStatus);

router.get('/absence-statuses/:id/reject', authenticate, adminController.rejectAbsenceStatus);

module.exports = router;
