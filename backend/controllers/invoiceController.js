const pool = require('../db');

const checkout = async (req, res) => {
  const userId = req.user.user_id;
  const { notes } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // get cart items
    const [cartRows] = await conn.query(`
      SELECT c.cart_id, c.product_id, c.quantity, p.price, p.stock
      FROM Customer_cart c
      JOIN Products p ON c.product_id = p.product_id
      WHERE c.user_id = ?
    `, [userId]);

    if (!cartRows.length) {
      await conn.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // compute total & check stock
    let total = 0;
    for (const item of cartRows) {
      if (item.stock < item.quantity) {
        await conn.rollback();
        return res.status(400).json({ message: `Insufficient stock for product ${item.product_id}`});
      }
      total += Number(item.price) * Number(item.quantity);
    }

    // create invoice
    // Insert without `notes` column because schema may not include it
    const [invoiceResult] = await conn.query('INSERT INTO Invoice (user_id, total_amount) VALUES (?, ?)', [userId, total]);
    const invoiceId = invoiceResult.insertId;

    // insert transactions and reduce product stock
    const transPromises = cartRows.map(item => {
      return conn.query('INSERT INTO Transaction (invoice_id, product_id, user_id, quantity, price, transaction_type) VALUES (?, ?, ?, ?, ?, ?)',
        [invoiceId, item.product_id, userId, item.quantity, item.price, 'sale']);
    });
    await Promise.all(transPromises);

    // reduce stock
    for (const item of cartRows) {
      await conn.query('UPDATE Products SET stock = stock - ? WHERE product_id = ?', [item.quantity, item.product_id]);
    }

    // clear cart
    await conn.query('DELETE FROM Customer_cart WHERE user_id = ?', [userId]);

    await conn.commit();
    res.json({ invoice_id: invoiceId, total });
  } catch (err) {
    await conn.rollback();
    console.error('Checkout error', err);
    // return server error message to assist developer instead of only generic message
    res.status(500).json({ message: 'Checkout failed', error: err.message });
  } finally {
    conn.release();
  }
};

const getInvoice = async (req, res) => {
  const invoiceId = req.params.id;
  try {
    const [invRows] = await pool.query('SELECT * FROM Invoice WHERE invoice_id = ?', [invoiceId]);
    if (!invRows.length) return res.status(404).json({ message: 'Invoice not found' });
    const invoice = invRows[0];
    const [items] = await pool.query(`
      SELECT t.transaction_id, t.product_id, t.quantity, t.price, p.product_name
      FROM Transaction t JOIN Products p ON t.product_id = p.product_id
      WHERE t.invoice_id = ?
    `, [invoiceId]);
    res.json({ invoice, items });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const listInvoices = async (req, res) => {
  const userId = req.user.user_id;
  try {
    const [rows] = await pool.query('SELECT * FROM Invoice WHERE user_id = ? ORDER BY date_time DESC', [userId]);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

module.exports = { checkout, getInvoice, listInvoices };
