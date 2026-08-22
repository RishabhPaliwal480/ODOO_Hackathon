const db = require('../config/db');

// Get all trips for current user
const getUserTrips = async (req, res, next) => {
  try {
    const userId = req.query.userId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const query = `
      SELECT t.*, 
             COUNT(DISTINCT s.id) as stop_count,
             COALESCE(SUM(s.lodging_cost + s.transport_cost), 0) + 
             COALESCE((SELECT SUM(cost) FROM trip_activities ta JOIN trip_stops ts ON ta.trip_stop_id = ts.id WHERE ts.trip_id = t.id), 0) as current_spent
      FROM trips t
      LEFT JOIN trip_stops s ON t.id = s.trip_id
      WHERE t.user_id = $1
      GROUP BY t.id
      ORDER BY t.start_date ASC
    `;
    const { rows } = await db.query(query, [userId]);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

// Get Full Trip details with stops and activities
const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tripRes = await db.query('SELECT * FROM trips WHERE id = $1', [id]);
    if (tripRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const stopsRes = await db.query(`
      SELECT s.*, c.name as city_name, c.country, c.image_url as city_image, c.cost_index
      FROM trip_stops s
      JOIN cities c ON s.city_id = c.id
      WHERE s.trip_id = $1
      ORDER BY s.stop_order ASC
    `, [id]);

    const stopIds = stopsRes.rows.map(s => s.id);
    let activities = [];
    if (stopIds.length > 0) {
      const actRes = await db.query(`
        SELECT ta.*, a.name as original_name, a.category, a.duration_hours
        FROM trip_activities ta
        LEFT JOIN activities a ON ta.activity_id = a.id
        WHERE ta.trip_stop_id = ANY($1::uuid[])
        ORDER BY ta.day_number ASC, ta.time_slot ASC
      `, [stopIds]);
      activities = actRes.rows;
    }

    // Attach activities to corresponding stops
    const stopsWithActivities = stopsRes.rows.map(stop => ({
      ...stop,
      activities: activities.filter(a => a.trip_stop_id === stop.id)
    }));

    res.json({
      success: true,
      data: {
        ...tripRes.rows[0],
        stops: stopsWithActivities
      }
    });
  } catch (err) { next(err); }
};

// Create new trip
const createTrip = async (req, res, next) => {
  try {
    const { title, description, start_date, end_date, estimated_budget, cover_image, is_public } = req.body;
    const userId = req.body.user_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    const query = `
      INSERT INTO trips (user_id, title, description, start_date, end_date, estimated_budget, cover_image, is_public, share_slug)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      userId, 
      title, 
      description, 
      start_date, 
      end_date, 
      estimated_budget || 1500.00, 
      cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', 
      is_public || false, 
      slug
    ];
    const { rows } = await db.query(query, values);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

// Delete Trip
const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM trips WHERE id = $1', [id]);
    res.json({ success: true, message: 'Trip deleted' });
  } catch (err) { next(err); }
};

// Public shared trip retrieval
const getSharedTrip = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const query = `
      SELECT t.*, u.name as organizer_name, u.avatar_url as organizer_avatar
      FROM trips t
      JOIN users u ON t.user_id = u.id
      WHERE (t.id::text = $1 OR t.share_slug = $1) AND t.is_public = TRUE
    `;
    const tripRes = await db.query(query, [slugOrId]);
    if (tripRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Shared trip not found or is private' });
    }

    const tripId = tripRes.rows[0].id;
    const stopsRes = await db.query(`
      SELECT s.*, c.name as city_name, c.country, c.image_url as city_image
      FROM trip_stops s
      JOIN cities c ON s.city_id = c.id
      WHERE s.trip_id = $1
      ORDER BY s.stop_order ASC
    `, [tripId]);

    const stopIds = stopsRes.rows.map(s => s.id);
    let activities = [];
    if (stopIds.length > 0) {
      const actRes = await db.query(`
        SELECT ta.*, a.category, a.duration_hours
        FROM trip_activities ta
        LEFT JOIN activities a ON ta.activity_id = a.id
        WHERE ta.trip_stop_id = ANY($1::uuid[])
        ORDER BY ta.day_number ASC
      `, [stopIds]);
      activities = actRes.rows;
    }

    const stopsWithActivities = stopsRes.rows.map(stop => ({
      ...stop,
      activities: activities.filter(a => a.trip_stop_id === stop.id)
    }));

    res.json({
      success: true,
      data: {
        ...tripRes.rows[0],
        stops: stopsWithActivities
      }
    });
  } catch (err) { next(err); }
};

// Clone / Copy a shared trip to user account
const copyTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const userId = req.body.user_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    // Fetch original
    const orig = await db.query('SELECT * FROM trips WHERE id = $1', [tripId]);
    if (orig.rows.length === 0) return res.status(404).json({ success: false, message: 'Source trip not found' });
    
    const o = orig.rows[0];
    const newSlug = o.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-copy-' + Math.random().toString(36).substring(2, 6);

    const newTrip = await db.query(`
      INSERT INTO trips (user_id, title, description, start_date, end_date, estimated_budget, cover_image, is_public, share_slug)
      VALUES ($1, $2, $3, CURRENT_DATE + 14, CURRENT_DATE + 21, $4, $5, FALSE, $6)
      RETURNING *
    `, [userId, `Copy of ${o.title}`, o.description, o.estimated_budget, o.cover_image, newSlug]);

    res.status(201).json({ success: true, message: 'Trip cloned successfully', data: newTrip.rows[0] });
  } catch (err) { next(err); }
};

module.exports = { getUserTrips, getTripById, createTrip, deleteTrip, getSharedTrip, copyTrip };