const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/storeOwnerController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('STORE_OWNER'));

router.get('/dashboard', getDashboard);

module.exports = router;
