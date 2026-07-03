const pool = require('../db');

const listBrands = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Brands ORDER BY brand_id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBrand = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Brands WHERE brand_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Brand not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const addBrand = async (req, res) => {
  const { brand_name, description } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO Brands (brand_name, description) VALUES (?, ?)', [brand_name, description || '']);
    res.json({ brand_id: result.insertId });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' });}
};

const updateBrand = async (req, res) => {
  const { brand_name, description } = req.body;
  try {
    await pool.query('UPDATE Brands SET brand_name=?, description=? WHERE brand_id=?', [brand_name, description||'', req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' });}
};

const deleteBrand = async (req, res) => {
  try {
    await pool.query('DELETE FROM Brands WHERE brand_id=?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' });}
};

module.exports = { listBrands, getBrand, addBrand, updateBrand, deleteBrand };
