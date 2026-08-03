const { Router } = require('express');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { search } = req.query;
  const params = [];
  let where = '';
  if (search) {
    params.push(`%${search}%`);
    where = 'WHERE term_kr ILIKE $1 OR romanization ILIKE $1 OR definition_en ILIKE $1';
  }
  const { rows } = await pool.query(`SELECT * FROM glossary_terms ${where} ORDER BY term_kr`, params);
  res.json(rows);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM glossary_terms WHERE id = $1', [req.params.id]);
  if (!rows[0]) {
    return res.status(404).json({ error: 'Glossary term not found' });
  }
  res.json(rows[0]);
}));

module.exports = router;
