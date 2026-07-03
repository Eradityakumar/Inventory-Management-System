const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { getSummary } = require('../controllers/dashboardController');

router.get('/', authenticate, getSummary);

module.exports = router;
