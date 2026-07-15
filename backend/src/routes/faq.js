const { Router } = require('express');
const pool = require('../db/pool');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { step_id: stepId } = req.query;
  const userId = req.user?.id ?? null;
  const params = [userId];
  let where = '';
  if (stepId) {
    params.push(stepId);
    where = 'AND p.step_id = $2';
  }
  const { rows } = await pool.query(
    `SELECT p.*, u.email AS asked_by,
            (SELECT COUNT(*) FROM faq_answers a WHERE a.post_id = p.id)::int AS answer_count,
            EXISTS(SELECT 1 FROM faq_post_upvotes v WHERE v.post_id = p.id AND v.user_id = $1) AS upvoted
     FROM faq_posts p
     JOIN users u ON u.id = p.user_id
     WHERE TRUE ${where}
     ORDER BY p.upvotes DESC, p.created_at DESC`,
    params
  );
  res.json(rows);
}));

router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const userId = req.user?.id ?? null;
  const { rows } = await pool.query(
    `SELECT p.*, u.email AS asked_by,
            EXISTS(SELECT 1 FROM faq_post_upvotes v WHERE v.post_id = p.id AND v.user_id = $2) AS upvoted
     FROM faq_posts p JOIN users u ON u.id = p.user_id WHERE p.id = $1`,
    [req.params.id, userId]
  );
  const post = rows[0];
  if (!post) {
    return res.status(404).json({ error: 'Question not found' });
  }
  const answers = await pool.query(
    `SELECT a.*, u.email AS answered_by,
            EXISTS(SELECT 1 FROM faq_answer_upvotes v WHERE v.answer_id = a.id AND v.user_id = $2) AS upvoted
     FROM faq_answers a JOIN users u ON u.id = a.user_id
     WHERE a.post_id = $1 ORDER BY a.upvotes DESC, a.created_at ASC`,
    [post.id, userId]
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
  res.status(201).json({ ...rows[0], upvoted: false });
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
  res.status(201).json({ ...rows[0], upvoted: false });
}));

// Toggles the current user's upvote on a question: adds it if missing,
// removes it if already present, so a post can't be upvoted repeatedly.
router.post('/:id/upvote', requireAuth, asyncHandler(async (req, res) => {
  const existing = await pool.query(
    'SELECT id FROM faq_post_upvotes WHERE user_id = $1 AND post_id = $2',
    [req.user.id, req.params.id]
  );

  let upvoted;
  if (existing.rows.length) {
    await pool.query('DELETE FROM faq_post_upvotes WHERE id = $1', [existing.rows[0].id]);
    await pool.query('UPDATE faq_posts SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = $1', [req.params.id]);
    upvoted = false;
  } else {
    await pool.query('INSERT INTO faq_post_upvotes (user_id, post_id) VALUES ($1, $2)', [req.user.id, req.params.id]);
    await pool.query('UPDATE faq_posts SET upvotes = upvotes + 1 WHERE id = $1', [req.params.id]);
    upvoted = true;
  }

  const { rows } = await pool.query('SELECT * FROM faq_posts WHERE id = $1', [req.params.id]);
  if (!rows[0]) {
    return res.status(404).json({ error: 'Question not found' });
  }
  res.json({ ...rows[0], upvoted });
}));

// Same toggle behavior as above, scoped to a single answer.
router.post('/:id/answers/:answerId/upvote', requireAuth, asyncHandler(async (req, res) => {
  const existing = await pool.query(
    'SELECT id FROM faq_answer_upvotes WHERE user_id = $1 AND answer_id = $2',
    [req.user.id, req.params.answerId]
  );

  let upvoted;
  if (existing.rows.length) {
    await pool.query('DELETE FROM faq_answer_upvotes WHERE id = $1', [existing.rows[0].id]);
    await pool.query('UPDATE faq_answers SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = $1', [req.params.answerId]);
    upvoted = false;
  } else {
    await pool.query('INSERT INTO faq_answer_upvotes (user_id, answer_id) VALUES ($1, $2)', [req.user.id, req.params.answerId]);
    await pool.query('UPDATE faq_answers SET upvotes = upvotes + 1 WHERE id = $1', [req.params.answerId]);
    upvoted = true;
  }

  const { rows } = await pool.query(
    'SELECT * FROM faq_answers WHERE id = $1 AND post_id = $2',
    [req.params.answerId, req.params.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ error: 'Answer not found' });
  }
  res.json({ ...rows[0], upvoted });
}));

module.exports = router;
