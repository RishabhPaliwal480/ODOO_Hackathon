const prisma = require('../config/prisma');
const { formatActivity, formatCity } = require('../utils/formatters');

const getCities = async (req, res, next) => {
  try {
    const { search, region, cost_index, limit = 24 } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (region) where.region = region;
    if (cost_index) where.costIndex = cost_index;

    const cities = await prisma.city.findMany({
      where,
      orderBy: [{ popularityScore: 'desc' }, { name: 'asc' }],
      take: Math.min(Number(limit) || 24, 50),
    });

    const uniqueCities = Array.from(
      new Map(cities.map((city) => [`${city.name}-${city.country}`.toLowerCase(), city])).values()
    );

    res.json({ success: true, data: uniqueCities.map(formatCity) });
  } catch (err) {
    next(err);
  }
};

const getCityDetails = async (req, res, next) => {
  try {
    const city = await prisma.city.findUnique({
      where: { id: req.params.id },
      include: { activities: { orderBy: [{ cost: 'asc' }, { name: 'asc' }] } },
    });
    if (!city) return res.status(404).json({ success: false, message: 'City not found' });
    res.json({ success: true, data: formatCity(city) });
  } catch (err) {
    next(err);
  }
};

const getActivities = async (req, res, next) => {
  try {
    const { search, category, city_id } = req.query;
    const where = {};

    if (city_id) where.cityId = city_id;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: [{ cost: 'asc' }, { name: 'asc' }],
      take: 50,
    });

    res.json({ success: true, data: activities.map(formatActivity) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getActivities, getCities, getCityDetails };
