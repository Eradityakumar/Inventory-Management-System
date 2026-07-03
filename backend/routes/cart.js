const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

router.get('/', authenticate, cartController.getCart); // list user's cart
router.post('/add', authenticate, cartController.addToCart); // add/update quantity
router.post('/remove', authenticate, cartController.removeFromCart); // remove item
router.post('/clear', authenticate, cartController.clearCart);
// add after existing routes in backend/routes/cart.js
router.post('/update', authenticate, cartController.updateQuantity);

module.exports = router;
