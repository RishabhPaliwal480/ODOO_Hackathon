const prisma = require('../config/prisma');
const { formatTrip } = require('../utils/formatters');
const { uniqueSlug } = require('../utils/slug');

const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const tripInclude = {
  user: true,
  stops: {
    orderBy: { stopOrder: 'asc' },
    include: {
      city: true,
      activities: {
        orderBy: [{ dayNumber: 'asc' }, { timeSlot: 'asc' }],
        include: { activity: true },
      },
    },
  },
};

const assertTripOwner = async (tripId, userId) =>
  prisma.trip.findFirst({ where: { id: tripId, userId }, include: tripInclude });

const getUserTrips = async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      orderBy: { startDate: 'asc' },
      include: tripInclude,
    });
    res.json({ success: true, data: trips.map(formatTrip) });
  } catch (err) {
    next(err);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const trip = await assertTripOwner(req.params.id, req.user.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, data: formatTrip(trip) });
  } catch (err) {
    next(err);
  }
};

const createTrip = async (req, res, next) => {
  try {
    const { title, description, start_date, end_date, estimated_budget, cover_image, is_public } = req.body;

    if (new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({ success: false, message: 'End date must be after start date' });
    }

    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id,
        title,
        description: description || null,
        startDate: new Date(start_date),
        endDate: new Date(end_date),
        estimatedBudget: estimated_budget ? Number(estimated_budget) : 1500,
        coverImage: cover_image || undefined,
        isPublic: Boolean(is_public),
        shareSlug: uniqueSlug(title),
      },
      include: tripInclude,
    });

    res.status(201).json({ success: true, data: formatTrip(trip) });
  } catch (err) {
    next(err);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const existing = await assertTripOwner(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Trip not found' });

    const data = {};
    if (req.body.title !== undefined) data.title = req.body.title;
    if (req.body.description !== undefined) data.description = req.body.description;
    if (req.body.start_date !== undefined) data.startDate = new Date(req.body.start_date);
    if (req.body.end_date !== undefined) data.endDate = new Date(req.body.end_date);
    if (req.body.estimated_budget !== undefined) data.estimatedBudget = Number(req.body.estimated_budget);
    if (req.body.cover_image !== undefined) data.coverImage = req.body.cover_image;
    if (req.body.is_public !== undefined) data.isPublic = Boolean(req.body.is_public);

    const trip = await prisma.trip.update({ where: { id: req.params.id }, data, include: tripInclude });
    res.json({ success: true, data: formatTrip(trip) });
  } catch (err) {
    next(err);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const existing = await assertTripOwner(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Trip not found' });
    await prisma.trip.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Trip deleted' });
  } catch (err) {
    next(err);
  }
};

const getSharedTrip = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const trip = await prisma.trip.findFirst({
      where: {
        isPublic: true,
        OR: [...(isUuid(slugOrId) ? [{ id: slugOrId }] : []), { shareSlug: slugOrId }],
      },
      include: tripInclude,
    });
    if (!trip) return res.status(404).json({ success: false, message: 'Shared trip not found or is private' });
    res.json({ success: true, data: formatTrip(trip) });
  } catch (err) {
    next(err);
  }
};

const copyTrip = async (req, res, next) => {
  try {
    const original = await prisma.trip.findFirst({
      where: { id: req.params.tripId, isPublic: true },
      include: tripInclude,
    });
    if (!original) return res.status(404).json({ success: false, message: 'Source trip not found' });

    const trip = await prisma.$transaction(async (tx) => {
      const copied = await tx.trip.create({
        data: {
          userId: req.user.id,
          title: `Copy of ${original.title}`,
          description: original.description,
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          estimatedBudget: original.estimatedBudget,
          coverImage: original.coverImage,
          isPublic: false,
          shareSlug: uniqueSlug(`${original.title}-copy`),
        },
      });

      for (const stop of original.stops) {
        const copiedStop = await tx.tripStop.create({
          data: {
            tripId: copied.id,
            cityId: stop.cityId,
            stopOrder: stop.stopOrder,
            arrivalDate: copied.startDate,
            departureDate: copied.endDate,
            lodgingCost: stop.lodgingCost,
            transportCost: stop.transportCost,
            notes: stop.notes,
          },
        });

        for (const item of stop.activities) {
          await tx.tripActivity.create({
            data: {
              tripStopId: copiedStop.id,
              activityId: item.activityId,
              customTitle: item.customTitle,
              dayNumber: item.dayNumber,
              timeSlot: item.timeSlot,
              cost: item.cost,
              notes: item.notes,
            },
          });
        }
      }

      return tx.trip.findUnique({ where: { id: copied.id }, include: tripInclude });
    });

    res.status(201).json({ success: true, message: 'Trip cloned successfully', data: formatTrip(trip) });
  } catch (err) {
    next(err);
  }
};

const getPublicTrips = async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { isPublic: true },
      orderBy: { updatedAt: 'desc' },
      take: 12,
      include: tripInclude,
    });
    res.json({ success: true, data: trips.map(formatTrip) });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  copyTrip,
  createTrip,
  deleteTrip,
  getPublicTrips,
  getSharedTrip,
  getTripById,
  getUserTrips,
  updateTrip,
};
