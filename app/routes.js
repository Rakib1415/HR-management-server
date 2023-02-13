const router = require('express').Router();

router.use(require('../routes'));

router.get('/health', (_req, res) => {
    res.status(200).json({ message: 'success' });
});

module.exports = router;
