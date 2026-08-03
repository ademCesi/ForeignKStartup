const { Router } = require('express');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM visas ORDER BY code');
  res.json(rows);
}));

router.get('/:code', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM visas WHERE code = $1', [req.params.code]);
  if (!rows[0]) {
    return res.status(404).json({ error: 'Visa not found' });
  }
  res.json(rows[0]);
}));

function recommend({ hasLongTermResidence, acceleratorSelected, ipStatus, hasCompany, capitalAvailable }) {
  if (hasLongTermResidence) {
    return { code: 'F-2-7', reason: 'You already hold long-term residence status, so the points-based F-2-7 route keeps you on a stable long-term base.' };
  }
  if (acceleratorSelected || ipStatus === 'patent' || ipStatus === 'prototype') {
    return { code: 'D-8-4S', reason: 'A registered patent, working prototype, or accelerator selection should score well on the OASIS points assessment for D-8-4S.' };
  }
  if (hasCompany && capitalAvailable) {
    return { code: 'D-8-4', reason: 'With a registered company and at least 100,000,000 KRW to invest, the standard corporate investment visa applies.' };
  }
  return { code: 'D-10-2', reason: 'Without a company or capital in place yet, the startup preparation visa lets you validate your idea in Korea first.' };
}

router.post('/recommend', asyncHandler(async (req, res) => {
  const answers = req.body || {};
  const { code, reason } = recommend(answers);
  const { rows } = await pool.query('SELECT * FROM visas WHERE code = $1', [code]);
  res.json({ recommendation: rows[0], reason });
}));

module.exports = router;
