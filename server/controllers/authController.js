const db = require('../config/db');

const login = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { rows } = await db.query(
      'SELECT id, name, email, phone, role, avatar_url, preferred_currency FROM users WHERE email = $1', 
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      user: rows[0],
      token: 'demo-local-session-token',
    });
  } catch (err) { next(err); }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const { rows } = await db.query(
      'INSERT INTO users (name, email, password_hash, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, avatar_url, preferred_currency',
      [name, email, 'hash_' + password, phone || null]
    );

    res.status(201).json({ success: true, user: rows[0] });
  } catch (err) { next(err); }
};

module.exports = { login, register };