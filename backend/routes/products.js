const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const {
  listProducts,
  getProduct,
  addProduct,
  deleteProduct
} = require('../controllers/productController');

router.get('/', authenticate, listProducts);
router.get('/:id', authenticate, getProduct);
router.post('/', authenticate, addProduct);
router.delete('/:id', authenticate, deleteProduct);

module.exports = router;
