const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const providerController = require('../controllers/providerController');

router.get('/', authenticate, providerController.listProviders);
router.get('/:id', authenticate, providerController.getProvider);
router.post('/', authenticate, providerController.addProvider);
router.put('/:id', authenticate, providerController.updateProvider);
router.delete('/:id', authenticate, providerController.deleteProvider);

module.exports = router;
