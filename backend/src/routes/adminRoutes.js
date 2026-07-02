const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  createUser,
  createStore,
  listStores,
  listUsers,
  getUserDetail,
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.post('/users', createUser);
router.get('/users', listUsers);
router.get('/users/:id', getUserDetail);
router.post('/stores', createStore);
router.get('/stores', listStores);

module.exports = router;
