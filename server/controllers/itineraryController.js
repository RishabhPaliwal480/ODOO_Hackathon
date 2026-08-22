const prisma = require('../config/prisma');
const { formatStop } = require('../utils/formatters');

const ensureStopOwner = async (stopId, userId) =>
  prisma.tripStop.findFirst({
    where: { id: stopId, trip: { userId } },
    include: { city: true, activities: { include: { activity: true } } },
  });

const addStop = async (req, res, next) => {
  try {
    const { trip_id, city_id, arrival_date, departure_date, lodging_cost, transport_cost, notes } = req.body;

    const trip = await prisma.trip.findFirst({ where: { id: trip_id, userId: req.user.id } });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    if (new Date(departure_date) < new Date(arrival_date)) {
      return res.status(400).json({ success: false, message: 'Departure date must be after arrival date' });
    }

    const stop = await prisma.$transaction(async (tx) => {
      const aggregate = await tx.tripStop.aggregate({
        where: { tripId: trip_id },
        _max: { stopOrder: true },
      });

      return tx.tripStop.create({
        data: {
          tripId: trip_id,
          cityId: city_id,
          stopOrder: (aggregate._max.stopOrder || 0) + 1,
          arrivalDate: new Date(arrival_date),
          departureDate: new Date(departure_date),
          lodgingCost: lodging_cost ? Number(lodging_cost) : 0,
          transportCost: transport_cost ? Number(transport_cost) : 0,
          notes: notes || null,
        },
        include: { city: true, activities: { include: { activity: true } } },
      });
    });

    res.status(201).json({ success: true, data: formatStop(stop) });
  } catch (err) {
    next(err);
  }
};

const addActivity = async (req, res, next) => {
  try {
    const { trip_stop_id, activity_id, custom_title, day_number, time_slot, cost, notes } = req.body;
    const stop = await ensureStopOwner(trip_stop_id, req.user.id);
    if (!stop) return res.status(404).json({ success: false, message: 'Trip stop not found' });

    const catalogActivity = activity_id ? await prisma.activity.findUnique({ where: { id: activity_id } }) : null;
    const item = await prisma.tripActivity.create({
      data: {
        tripStopId: trip_stop_id,
        activityId: activity_id || null,
        customTitle: custom_title || catalogActivity?.name || 'Custom activity',
        dayNumber: day_number ? Number(day_number) : 1,
        timeSlot: time_slot || 'Morning',
        cost: cost !== undefined ? Number(cost) : Number(catalogActivity?.cost || 0),
        notes: notes || null,
      },
      include: { activity: true },
    });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const deleteStop = async (req, res, next) => {
  try {
    const stop = await ensureStopOwner(req.params.id, req.user.id);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });

    await prisma.tripStop.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Stop removed' });
  } catch (err) {
    next(err);
  }
};

const deleteActivity = async (req, res, next) => {
  try {
    const activity = await prisma.tripActivity.findFirst({
      where: { id: req.params.id, stop: { trip: { userId: req.user.id } } },
    });
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    await prisma.tripActivity.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Activity removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { addActivity, addStop, deleteActivity, deleteStop };
