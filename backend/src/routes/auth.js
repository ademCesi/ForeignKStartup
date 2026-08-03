const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, language, target_visa: targetVisa } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, language, target_visa)
     VALUES ($1, $2, COALESCE($3, 'en'), $4)
     RETURNING id, email, language, target_visa, created_at`,
    [email, passwordHash, language, targetVisa || null]
  );
  const user = rows[0];
  res.status(201).json({ user, token: signToken(user) });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const account = rows[0];
  if (!account || !(await bcrypt.compare(password, account.password_hash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const user = {
    id: account.id,
    email: account.email,
    language: account.language,
    target_visa: account.target_visa,
    created_at: account.created_at,
  };
  res.json({ user, token: signToken(user) });
}));

router.post('/logout', (req, res) => {
  // Tokens are stateless JWTs; the client discards the token to "log out".
  res.status(204).end();
});

module.exports = router;
