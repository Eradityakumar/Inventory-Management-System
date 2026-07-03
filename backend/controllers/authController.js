const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, password, contact_no, user_type } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM inv_user WHERE username = ?', [username]);
    if (existing.length) return res.status(400).json({ message: 'Username already taken' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO inv_user (username, password, user_type, contact_no) VALUES (?, ?, ?, ?)',
      [username, hashed, user_type || 'staff', contact_no || '']
    );
    const userId = result.insertId;
    const token = jwt.sign({ user_id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log('Login attempt for username:', username);
    const [rows] = await pool.query('SELECT * FROM inv_user WHERE username = ?', [username]);
    if (!rows.length) return res.status(400).json({ message: 'Invalid credentials' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const me = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const [rows] = await pool.query('SELECT user_id, username, user_type, contact_no FROM inv_user WHERE user_id = ?', [userId]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, me };
