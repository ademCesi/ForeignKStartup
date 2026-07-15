const { Router } = require('express');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const conditions = [];
  const params = [];

  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    conditions.push(`name ILIKE $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(`SELECT * FROM services ${where} ORDER BY name`, params);
  res.json(rows);
}));

module.exports = router;
