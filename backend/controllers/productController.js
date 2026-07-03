const pool = require('../db');

const listProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.product_id, p.product_name, p.price, p.stock, p.description,
             b.brand_name, c.category_name, pr.provider_name
      FROM Products p
      LEFT JOIN Brands b ON p.brand_id = b.brand_id
      LEFT JOIN Categories c ON p.category_id = c.category_id
      LEFT JOIN Providers pr ON p.provider_id = pr.provider_id
      ORDER BY p.product_id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM Products WHERE product_id = ? AND (active IS NULL OR active = 1)', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addProduct = async (req, res) => {
  const { product_name, brand_id, category_id, provider_id, price, stock, description } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO Products (product_name, brand_id, category_id, provider_id, price, stock, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [product_name, brand_id || null, category_id || null, provider_id || null, price || 0, stock || 0, description || '']
    );
    res.json({ product_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    // Permanent delete - attempt to remove all references first
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      // Remove from carts so FK from Customer_cart doesn't prevent delete
      await conn.query('DELETE FROM Customer_cart WHERE product_id = ?', [id]);
      const [result] = await conn.query('DELETE FROM Products WHERE product_id = ?', [id]);
      if (result.affectedRows === 0) {
        await conn.rollback();
        return res.status(404).json({ message: 'Product not found' });
      }
      await conn.commit();
      res.json({ message: 'Product permanently deleted' });
    } catch (e) {
      try { await conn.rollback(); } catch (err2) {}
      // If the delete fails due to transactions (sales history), inform user
      if (e && e.errno === 1451) {
        return res.status(400).json({ message: 'Cannot permanently delete product: it is referenced by transactions. Remove those records first.' });
      }
      throw e;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Delete product error:', err);
    // MySQL foreign key constraint prevents deletion when the product is referenced by other records
    // ER_ROW_IS_REFERENCED_2 => errno 1451
    if (err && err.errno === 1451) {
      return res.status(400).json({ message: 'Cannot delete product: it is referenced by other records (transactions, cart). Remove those first.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listProducts, getProduct, addProduct, deleteProduct };
