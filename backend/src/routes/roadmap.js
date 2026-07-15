const { Router } = require('express');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM roadmap_steps ORDER BY step_order');
  res.json(rows);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM roadmap_steps WHERE id = $1', [req.params.id]);
  const step = rows[0];
  if (!step) {
    return res.status(404).json({ error: 'Step not found' });
  }
  const documents = await pool.query('SELECT * FROM documents WHERE step_id = $1', [step.id]);
  res.json({ ...step, documents: documents.rows });
}));

module.exports = router;
