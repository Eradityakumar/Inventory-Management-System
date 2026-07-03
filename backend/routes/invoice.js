const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const invoiceController = require('../controllers/invoiceController');

router.post('/checkout', authenticate, invoiceController.checkout); // create invoice from cart
router.get('/:id', authenticate, invoiceController.getInvoice); // get invoice + items
router.get('/', authenticate, invoiceController.listInvoices); // list user's invoices

module.exports = router;
