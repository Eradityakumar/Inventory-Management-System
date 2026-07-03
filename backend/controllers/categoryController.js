const pool = require('../db');

const listCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Categories ORDER BY category_id DESC');
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const addCategory = async (req, res) => {
  const { category_name, description } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO Categories (category_name, description) VALUES (?, ?)', [category_name, description || '']);
    res.json({ category_id: result.insertId });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const updateCategory = async (req, res) => {
  const { category_name, description } = req.body;
  try {
    await pool.query('UPDATE Categories SET category_name=?, description=? WHERE category_id=?', [category_name, description||'', req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const deleteCategory = async (req, res) => {
  try {
    await pool.query('DELETE FROM Categories WHERE category_id=?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

module.exports = { listCategories, addCategory, updateCategory, deleteCategory };
