const db = require('../config/db');

// Add city stop to a trip
const addStop = async (req, res, next) => {
  try {
    const { trip_id, city_id, arrival_date, departure_date, lodging_cost, transport_cost, notes } = req.body;
    
    // Determine next stop order
    const orderRes = await db.query('SELECT COALESCE(MAX(stop_order), 0) + 1 as next_order FROM trip_stops WHERE trip_id = $1', [trip_id]);
    const stopOrder = orderRes.rows[0].next_order;

    const query = `
      INSERT INTO trip_stops (trip_id, city_id, stop_order, arrival_date, departure_date, lodging_cost, transport_cost, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const { rows } = await db.query(query, [
      trip_id, city_id, stopOrder, arrival_date, departure_date, lodging_cost || 0, transport_cost || 0, notes
    ]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

// Add activity to a stop
const addActivity = async (req, res, next) => {
  try {
    const { trip_stop_id, activity_id, custom_title, day_number, time_slot, cost, notes } = req.body;
    const query = `
      INSERT INTO trip_activities (trip_stop_id, activity_id, custom_title, day_number, time_slot, cost, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const { rows } = await db.query(query, [
      trip_stop_id, activity_id || null, custom_title, day_number || 1, time_slot || 'Morning', cost || 0, notes
    ]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
};

// Delete stop
const deleteStop = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM trip_stops WHERE id = $1', [id]);
    res.json({ success: true, message: 'Stop removed' });
  } catch (err) { next(err); }
};

// Delete activity
const deleteActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM trip_activities WHERE id = $1', [id]);
    res.json({ success: true, message: 'Activity removed' });
  } catch (err) { next(err); }
};

module.exports = { addStop, addActivity, deleteStop, deleteActivity };