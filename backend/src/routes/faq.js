const { Router } = require('express');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { step_id: stepId } = req.query;
  const params = [];
  let where = '';
  if (stepId) {
    params.push(stepId);
    where = 'WHERE p.step_id = $1';
  }
  const { rows } = await pool.query(
    `SELECT p.*, u.email AS asked_by,
            (SELECT COUNT(*) FROM faq_answers a WHERE a.post_id = p.id)::int AS answer_count
     FROM faq_posts p
     JOIN users u ON u.id = p.user_id
     ${where}
     ORDER BY p.created_at DESC`,
    params
  );
  res.json(rows);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT p.*, u.email AS asked_by FROM faq_posts p JOIN users u ON u.id = p.user_id WHERE p.id = $1`,
    [req.params.id]
  );
  const post = rows[0];
  if (!post) {
    return res.status(404).json({ error: 'Question not found' });
  }
  const answers = await pool.query(
    `SELECT a.*, u.email AS answered_by FROM faq_answers a JOIN users u ON u.id = a.user_id
     WHERE a.post_id = $1 ORDER BY a.upvotes DESC, a.created_at ASC`,
    [post.id]
  );
  res.json({ ...post, answers: answers.rows });
}));

router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { step_id: stepId, question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'question is required' });
  }
  const { rows } = await pool.query(
    'INSERT INTO faq_posts (user_id, step_id, question) VALUES ($1, $2, $3) RETURNING *',
    [req.user.id, stepId || null, question]
  );
  res.status(201).json(rows[0]);
}));

router.patch('/:id', requireAuth, asyncHandler(async (req, res) => {
  const { question } = req.body;
  const { rows } = await pool.query(
    'UPDATE faq_posts SET question = COALESCE($1, question) WHERE id = $2 AND user_id = $3 RETURNING *',
    [question, req.params.id, req.user.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ error: 'Question not found or not owned by you' });
  }
  res.json(rows[0]);
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'DELETE FROM faq_posts WHERE id = $1 AND user_id = $2 RETURNING id',
    [req.params.id, req.user.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ error: 'Question not found or not owned by you' });
  }
  res.status(204).end();
}));

router.post('/:id/answers', requireAuth, asyncHandler(async (req, res) => {
  const { answer } = req.body;
  if (!answer) {
    return res.status(400).json({ error: 'answer is required' });
  }
  const { rows } = await pool.query(
    'INSERT INTO faq_answers (post_id, user_id, answer) VALUES ($1, $2, $3) RETURNING *',
    [req.params.id, req.user.id, answer]
  );
  res.status(201).json(rows[0]);
}));

router.post('/:id/upvote', requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'UPDATE faq_posts SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *',
    [req.params.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ error: 'Question not found' });
  }
  res.json(rows[0]);
}));

router.post('/:id/answers/:answerId/upvote', requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'UPDATE faq_answers SET upvotes = upvotes + 1 WHERE id = $1 AND post_id = $2 RETURNING *',
    [req.params.answerId, req.params.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ error: 'Answer not found' });
  }
  res.json(rows[0]);
}));

module.exports = router;
