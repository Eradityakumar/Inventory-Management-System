const pool = require('../db');

const getCart = async (req, res) => {
  const userId = req.user.user_id;
  try {
    const [rows] = await pool.query(`
      SELECT c.cart_id, c.product_id, c.quantity,
             p.product_name, p.price, p.stock
      FROM Customer_cart c
      JOIN Products p ON c.product_id = p.product_id
      WHERE c.user_id = ?
    `, [userId]);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const addToCart = async (req, res) => {
  const userId = req.user.user_id;
  const { product_id, quantity } = req.body;
  try {
    // First check if product exists and has sufficient stock
    const [productRows] = await pool.query('SELECT stock, product_name FROM Products WHERE product_id = ?', [product_id]);
    if (!productRows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = productRows[0];
    if (product.stock <= 0) {
      return res.status(400).json({ message: `${product.product_name} is out of stock` });
    }

    // Check existing cart items for this user and product
    const [existing] = await pool.query('SELECT cart_id, quantity FROM Customer_cart WHERE user_id=? AND product_id=?', [userId, product_id]);

    let newQuantity = quantity;
    if (existing.length) {
      newQuantity = existing[0].quantity + quantity;
    }

    // Check if the total quantity would exceed available stock
    if (newQuantity > product.stock) {
      return res.status(400).json({
        message: `Cannot add ${quantity} more ${product.product_name}(s). Only ${product.stock} available in stock.`
      });
    }

    if (existing.length) {
      // update quantity
      await pool.query('UPDATE Customer_cart SET quantity = quantity + ? WHERE cart_id = ?', [quantity, existing[0].cart_id]);
      return res.json({ message: 'Updated cart quantity' });
    }

    await pool.query('INSERT INTO Customer_cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, product_id, quantity]);
    res.json({ message: 'Added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFromCart = async (req, res) => {
  const userId = req.user.user_id;
  const { cart_id } = req.body;
  try {
    await pool.query('DELETE FROM Customer_cart WHERE cart_id = ? AND user_id = ?', [cart_id, userId]);
    res.json({ message: 'Removed' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};
// inside controllers/cartController.js (with other exports)
const updateQuantity = async (req, res) => {
  const userId = req.user.user_id;
  const { cart_id, quantity } = req.body;
  if (!cart_id || typeof quantity === 'undefined') {
    return res.status(400).json({ message: 'cart_id and quantity required' });
  }
  if (quantity < 1) {
    // remove when quantity set to less than 1
    try {
      await pool.query('DELETE FROM Customer_cart WHERE cart_id = ? AND user_id = ?', [cart_id, userId]);
      return res.json({ message: 'Removed' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  try {
    // Check stock of product referenced by cart item
    const [cartRows] = await pool.query('SELECT product_id FROM Customer_cart WHERE cart_id = ? AND user_id = ?', [cart_id, userId]);
    if (!cartRows.length) return res.status(404).json({ message: 'Cart item not found' });

    const productId = cartRows[0].product_id;
    const [prodRows] = await pool.query('SELECT stock FROM Products WHERE product_id = ?', [productId]);
    if (!prodRows.length) return res.status(404).json({ message: 'Product not found' });

    if (prodRows[0].stock < quantity) {
      return res.status(400).json({ message: `Insufficient stock. Only ${prodRows[0].stock} available.` });
    }

    await pool.query('UPDATE Customer_cart SET quantity = ? WHERE cart_id = ? AND user_id = ?', [quantity, cart_id, userId]);
    res.json({ message: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const clearCart = async (req, res) => {
  const userId = req.user.user_id;
  try {
    await pool.query('DELETE FROM Customer_cart WHERE user_id = ?', [userId]);
    res.json({ message: 'Cleared' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart, updateQuantity };
