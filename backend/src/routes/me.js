const { Router } = require('express');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();
router.use(requireAuth);

router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, email, language, target_visa, created_at FROM users WHERE id = $1',
    [req.user.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(rows[0]);
}));

router.patch('/', asyncHandler(async (req, res) => {
  const { language, target_visa: targetVisa } = req.body;
  const { rows } = await pool.query(
    `UPDATE users SET language = COALESCE($1, language), target_visa = COALESCE($2, target_visa)
     WHERE id = $3
     RETURNING id, email, language, target_visa, created_at`,
    [language, targetVisa, req.user.id]
  );
  res.json(rows[0]);
}));

router.get('/progress', asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT s.id AS step_id, s.step_order, s.title,
            COALESCE(p.status, 'not_started') AS status, p.completed_at
     FROM roadmap_steps s
     LEFT JOIN user_progress p ON p.step_id = s.id AND p.user_id = $1
     ORDER BY s.step_order`,
    [req.user.id]
  );
  res.json(rows);
}));

router.patch('/progress/:stepId', asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['not_started', 'in_progress', 'done'].includes(status)) {
    return res.status(400).json({ error: 'status must be not_started, in_progress, or done' });
  }
  const completedAt = status === 'done' ? new Date() : null;
  const { rows } = await pool.query(
    `INSERT INTO user_progress (user_id, step_id, status, completed_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, step_id)
     DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at
     RETURNING *`,
    [req.user.id, req.params.stepId, status, completedAt]
  );
  res.json(rows[0]);
}));

router.get('/documents', asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT d.id AS document_id, d.step_id, d.name, d.needs_apostille, d.needs_translation,
            COALESCE(ud.status, 'pending') AS status
     FROM documents d
     LEFT JOIN user_documents ud ON ud.document_id = d.id AND ud.user_id = $1
     ORDER BY d.step_id, d.id`,
    [req.user.id]
  );
  res.json(rows);
}));

router.patch('/documents/:id', asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'ready'].includes(status)) {
    return res.status(400).json({ error: 'status must be pending or ready' });
  }
  const { rows } = await pool.query(
    `INSERT INTO user_documents (user_id, document_id, status)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, document_id)
     DO UPDATE SET status = EXCLUDED.status
     RETURNING *`,
    [req.user.id, req.params.id, status]
  );
  res.json(rows[0]);
}));

module.exports = router;
