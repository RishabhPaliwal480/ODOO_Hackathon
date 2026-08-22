const db = require('../config/db');

const getGlobalAnalytics = async (req, res, next) => {
  try {
    const [tripsCount, usersCount, topCities, budgetStats] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM trips'),
      db.query('SELECT COUNT(*) as count FROM users'),
      db.query(`
        SELECT c.name, c.country, COUNT(s.id) as visit_count
        FROM cities c
        JOIN trip_stops s ON c.id = s.city_id
        GROUP BY c.id
        ORDER BY visit_count DESC LIMIT 5
      `),
      db.query('SELECT AVG(estimated_budget) as avg_budget FROM trips'),
    ]);

    res.json({
      success: true,
      data: {
        totalTrips: parseInt(tripsCount.rows[0].count, 10),
        totalUsers: parseInt(usersCount.rows[0].count, 10),
        topDestinations: topCities.rows,
        avgBudget: Math.round(budgetStats.rows[0].avg_budget || 0),
      }
    });
  } catch (err) { next(err); }
};

module.exports = { getGlobalAnalytics };