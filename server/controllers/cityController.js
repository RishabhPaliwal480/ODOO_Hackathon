const db = require('../config/db');

const getCities = async (req, res, next) => {
  try {
    const { search, region, cost_index } = req.query;
    let queryText = 'SELECT * FROM cities WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND (name ILIKE $${params.length} OR country ILIKE $${params.length})`;
    }
    if (region) {
      params.push(region);
      queryText += ` AND region = $${params.length}`;
    }
    if (cost_index) {
      params.push(cost_index);
      queryText += ` AND cost_index = $${params.length}`;
    }

    queryText += ' ORDER BY popularity_score DESC';
    const { rows } = await db.query(queryText, params);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

const getCityDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cityRes = await db.query('SELECT * FROM cities WHERE id = $1', [id]);
    if (cityRes.rows.length === 0) return res.status(404).json({ success: false, message: 'City not found' });

    const actRes = await db.query('SELECT * FROM activities WHERE city_id = $1 ORDER BY cost ASC', [id]);
    res.json({
      success: true,
      data: {
        ...cityRes.rows[0],
        activities: actRes.rows
      }
    });
  } catch (err) { next(err); }
};

module.exports = { getCities, getCityDetails };