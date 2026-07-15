const { Router } = require('express');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { type } = req.query;
  const params = [];
  let where = '';
  if (type) {
    params.push(type);
    where = 'WHERE type = $1';
  }
  const { rows } = await pool.query(`SELECT * FROM funding_programs ${where} ORDER BY name`, params);
  res.json(rows);
}));

module.exports = router;
