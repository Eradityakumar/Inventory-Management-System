const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const categoryController = require('../controllers/categoryController');

router.get('/', authenticate, categoryController.listCategories);
router.post('/', authenticate, categoryController.addCategory);
router.put('/:id', authenticate, categoryController.updateCategory);
router.delete('/:id', authenticate, categoryController.deleteCategory);

module.exports = router;
