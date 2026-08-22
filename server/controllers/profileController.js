const prisma = require('../config/prisma');
const { formatCity, publicUser } = require('../utils/formatters');

const updateProfile = async (req, res, next) => {
  try {
    const data = {};
    if (req.body.name !== undefined) data.name = req.body.name;
    if (req.body.phone !== undefined) data.phone = req.body.phone || null;
    if (req.body.avatar_url !== undefined) data.avatarUrl = req.body.avatar_url || null;
    if (req.body.preferred_currency !== undefined) data.preferredCurrency = req.body.preferred_currency;

    const user = await prisma.user.update({ where: { id: req.user.id }, data });
    res.json({ success: true, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

const getSavedDestinations = async (req, res, next) => {
  try {
    const saved = await prisma.savedDestination.findMany({
      where: { userId: req.user.id },
      include: { city: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: saved.map((item) => formatCity(item.city)) });
  } catch (err) {
    next(err);
  }
};

const saveDestination = async (req, res, next) => {
  try {
    const saved = await prisma.savedDestination.upsert({
      where: { userId_cityId: { userId: req.user.id, cityId: req.params.cityId } },
      update: {},
      create: { userId: req.user.id, cityId: req.params.cityId },
      include: { city: true },
    });
    res.status(201).json({ success: true, data: formatCity(saved.city) });
  } catch (err) {
    next(err);
  }
};

const removeSavedDestination = async (req, res, next) => {
  try {
    await prisma.savedDestination.delete({
      where: { userId_cityId: { userId: req.user.id, cityId: req.params.cityId } },
    });
    res.json({ success: true, message: 'Destination removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSavedDestinations, removeSavedDestination, saveDestination, updateProfile };
