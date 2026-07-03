const pool = require('../db');

const getSummary = async (req, res) => {
  try {
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM Products WHERE active IS NULL OR active = 1');
    const [[{ low_stock_count }]] = await pool.query('SELECT COUNT(*) as low_stock_count FROM Products WHERE (active IS NULL OR active = 1) AND stock < 5');
    const [[{ total_stock_value }]] = await pool.query('SELECT IFNULL(SUM(price * stock), 0) as total_stock_value FROM Products WHERE (active IS NULL OR active = 1)');
    // scope invoices/transactions/cart items to the authenticated user
    const userId = req.user && req.user.user_id;
    const [[{ total_invoices }]] = await pool.query('SELECT COUNT(*) as total_invoices FROM Invoice WHERE user_id = ?', [userId]);
    const [[{ total_transactions }]] = await pool.query('SELECT COUNT(*) as total_transactions FROM Transaction WHERE user_id = ?', [userId]);
    const [[{ total_users }]] = await pool.query('SELECT COUNT(*) as total_users FROM inv_user');
    const [[{ items_in_carts }]] = await pool.query('SELECT IFNULL(SUM(quantity), 0) as items_in_carts FROM Customer_cart WHERE user_id = ?', [userId]);
    const [lowStockProducts] = await pool.query('SELECT product_id, product_name, stock FROM Products WHERE (active IS NULL OR active = 1) AND stock < 5 ORDER BY stock ASC LIMIT 10');

    res.json({
      total_products: total,
      low_stock_count,
      total_stock_value,
      total_invoices,
      total_transactions,
      total_users,
      items_in_carts,
      low_stock_products: lowStockProducts
    });
  } catch (err) {
    console.error('Dashboard summary error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSummary };
