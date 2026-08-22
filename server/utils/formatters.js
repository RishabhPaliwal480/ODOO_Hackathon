const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  return Number(value);
};

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  avatar_url: user.avatarUrl,
  preferred_currency: user.preferredCurrency,
  created_at: user.createdAt,
});

const formatActivity = (activity) => ({
  id: activity.id,
  city_id: activity.cityId,
  name: activity.name,
  category: activity.category,
  description: activity.description,
  duration_hours: toNumber(activity.durationHours),
  cost: toNumber(activity.cost),
  image_url: activity.imageUrl,
  created_at: activity.createdAt,
});

const formatCity = (city) => ({
  id: city.id,
  name: city.name,
  country: city.country,
  region: city.region,
  description: city.description,
  cost_index: city.costIndex,
  popularity_score: city.popularityScore,
  image_url: city.imageUrl,
  avg_daily_cost: toNumber(city.avgDailyCost),
  created_at: city.createdAt,
  activities: city.activities?.map(formatActivity),
});

const formatTripActivity = (item) => ({
  id: item.id,
  trip_stop_id: item.tripStopId,
  activity_id: item.activityId,
  custom_title: item.customTitle,
  title: item.customTitle || item.activity?.name || 'Custom activity',
  original_name: item.activity?.name,
  category: item.activity?.category || 'Leisure',
  duration_hours: item.activity ? toNumber(item.activity.durationHours) : 1,
  day_number: item.dayNumber,
  time_slot: item.timeSlot,
  cost: toNumber(item.cost),
  is_completed: item.isCompleted,
  notes: item.notes,
});

const formatStop = (stop) => ({
  id: stop.id,
  trip_id: stop.tripId,
  city_id: stop.cityId,
  stop_order: stop.stopOrder,
  arrival_date: stop.arrivalDate,
  departure_date: stop.departureDate,
  lodging_cost: toNumber(stop.lodgingCost),
  transport_cost: toNumber(stop.transportCost),
  notes: stop.notes,
  created_at: stop.createdAt,
  city_name: stop.city?.name,
  country: stop.city?.country,
  city_image: stop.city?.imageUrl,
  cost_index: stop.city?.costIndex,
  activities: stop.activities?.map(formatTripActivity) || [],
});

const calculateTripSpend = (trip) => {
  const stops = trip.stops || [];
  return stops.reduce((total, stop) => {
    const stopBase = toNumber(stop.lodgingCost) + toNumber(stop.transportCost);
    const activityCost = (stop.activities || []).reduce((sum, item) => sum + toNumber(item.cost), 0);
    return total + stopBase + activityCost;
  }, 0);
};

const formatTrip = (trip) => ({
  id: trip.id,
  user_id: trip.userId,
  title: trip.title,
  description: trip.description,
  start_date: trip.startDate,
  end_date: trip.endDate,
  estimated_budget: toNumber(trip.estimatedBudget),
  cover_image: trip.coverImage,
  is_public: trip.isPublic,
  share_slug: trip.shareSlug,
  created_at: trip.createdAt,
  updated_at: trip.updatedAt,
  organizer_name: trip.user?.name,
  organizer_avatar: trip.user?.avatarUrl,
  stop_count: trip.stops?.length || 0,
  current_spent: calculateTripSpend(trip),
  stops: trip.stops?.map(formatStop),
});

module.exports = {
  calculateTripSpend,
  formatActivity,
  formatCity,
  formatStop,
  formatTrip,
  publicUser,
  toNumber,
};
