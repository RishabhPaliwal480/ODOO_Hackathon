const prisma = require('../config/prisma');
const { toNumber } = require('../utils/formatters');

const getGlobalAnalytics = async (req, res, next) => {
  try {
    const [totalTrips, totalUsers, topCities, budgetStats, activityStats] = await Promise.all([
      prisma.trip.count(),
      prisma.user.count(),
      prisma.tripStop.groupBy({
        by: ['cityId'],
        _count: { cityId: true },
        orderBy: { _count: { cityId: 'desc' } },
        take: 5,
      }),
      prisma.trip.aggregate({ _avg: { estimatedBudget: true } }),
      prisma.tripActivity.aggregate({ _sum: { cost: true }, _count: true }),
    ]);

    const cities = await prisma.city.findMany({
      where: { id: { in: topCities.map((item) => item.cityId) } },
    });

    const destinations = topCities.map((item) => {
      const city = cities.find((entry) => entry.id === item.cityId);
      return {
        name: city?.name || 'Unknown',
        country: city?.country || '',
        visit_count: item._count.cityId,
      };
    });

    res.json({
      success: true,
      data: {
        totalTrips,
        totalUsers,
        topDestinations: destinations,
        avgBudget: Math.round(toNumber(budgetStats._avg.estimatedBudget)),
        activitySpend: toNumber(activityStats._sum.cost),
        scheduledActivities: activityStats._count,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getGlobalAnalytics };
