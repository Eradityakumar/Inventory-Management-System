const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const brandController = require('../controllers/brandController');

router.get('/', authenticate, brandController.listBrands);
router.get('/:id', authenticate, brandController.getBrand);
router.post('/', authenticate, brandController.addBrand);
router.put('/:id', authenticate, brandController.updateBrand);
router.delete('/:id', authenticate, brandController.deleteBrand);

module.exports = router;
