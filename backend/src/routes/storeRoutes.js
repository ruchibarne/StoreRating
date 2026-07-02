const express = require('express');
const router = express.Router();
const { browseStores, submitRating, updateRating } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('USER'));

router.get('/', browseStores);
router.post('/:storeId/rating', submitRating);
router.put('/:storeId/rating', updateRating);

module.exports = router;
