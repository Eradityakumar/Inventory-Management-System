const pool = require('../db');

const listProviders = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Providers ORDER BY provider_id DESC');
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const getProvider = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Providers WHERE provider_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Provider not found' });
    res.json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const addProvider = async (req, res) => {
  const { provider_name, address, contact_no, website } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO Providers (provider_name, address, contact_no, website) VALUES (?, ?, ?, ?)', [provider_name, address || '', contact_no || '', website || '']);
    res.json({ provider_id: result.insertId });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const updateProvider = async (req, res) => {
  const { provider_name, address, contact_no, website } = req.body;
  try {
    await pool.query('UPDATE Providers SET provider_name=?, address=?, contact_no=?, website=? WHERE provider_id=?', [provider_name, address || '', contact_no || '', website || '', req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const deleteProvider = async (req, res) => {
  try {
    await pool.query('DELETE FROM Providers WHERE provider_id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

module.exports = { listProviders, getProvider, addProvider, updateProvider, deleteProvider };
