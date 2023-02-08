const router = require('express').Router();
const employeeController = require('../controllers/employees');
const authenticate = require('../middlewares/authenticate');

router.post('/auth/login', employeeController.login);

router.post('/auth/reset-password', authenticate, employeeController.resetPassword);

router.get('/profile', (req, res) => {
    res.send('get profile route!');
});
router.patch('/profile', (req, res) => {
    res.send('update profile route!');
});

router.patch('/profile/avatar', (req, res) => {
    res.send('update avatar profile route!');
});

router.post('/absence-requests', authenticate, employeeController.createAbsenceRequest);

router.get('/absence-requests', authenticate, employeeController.getAllAbsenceRequest);

router.put('/absence-requests/:id', authenticate, employeeController.updateAbsenceRequestById);

router.delete('/absence-requests/:id', authenticate, employeeController.deleteAbsenceRequestById);

module.exports = router;
