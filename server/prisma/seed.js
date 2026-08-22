const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

const cities = [
  {
    id: 'c1111111-1111-4111-8111-111111111111',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    description: 'The City of Light known for art, fashion, gastronomy, and the iconic Eiffel Tower.',
    costIndex: 'Luxury',
    popularityScore: 98,
    avgDailyCost: 180,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'c2222222-2222-4222-8222-222222222222',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    description: 'A vivid mix of ultramodern streets, historic shrines, tiny bars, and excellent food.',
    costIndex: 'Moderate',
    popularityScore: 96,
    avgDailyCost: 140,
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'c3333333-3333-4333-8333-333333333333',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    description: 'Centuries of monumental history, piazzas, trattorias, the Colosseum, and Vatican art.',
    costIndex: 'Moderate',
    popularityScore: 94,
    avgDailyCost: 130,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'c4444444-4444-4444-8444-444444444444',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    description: 'Tropical beaches, rainforest terraces, temples, waterfalls, and slow coastal evenings.',
    costIndex: 'Budget',
    popularityScore: 92,
    avgDailyCost: 50,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'c5555555-5555-4555-8555-555555555555',
    name: 'New York',
    country: 'United States',
    region: 'North America',
    description: 'A dense metropolis of Broadway, museums, parks, skyline views, and late-night food.',
    costIndex: 'Luxury',
    popularityScore: 97,
    avgDailyCost: 220,
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'c6666666-6666-4666-8666-666666666666',
    name: 'Jaipur',
    country: 'India',
    region: 'South Asia',
    description: 'The Pink City, full of forts, palaces, markets, craft workshops, and desert gateways.',
    costIndex: 'Budget',
    popularityScore: 89,
    avgDailyCost: 45,
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&auto=format&fit=crop&q=80',
  },
];

const activities = [
  ['c1111111-1111-4111-8111-111111111111', 'Eiffel Tower Summit Access', 'Sightseeing', 'Panoramic city views from the upper levels of Paris most recognizable landmark.', 3, 45, 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&auto=format&fit=crop&q=80'],
  ['c1111111-1111-4111-8111-111111111111', 'Louvre Museum Guided Walk', 'Culture', 'A focused walk through essential masterworks and quieter wings.', 3.5, 30, 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&auto=format&fit=crop&q=80'],
  ['c1111111-1111-4111-8111-111111111111', 'Seine River Dinner Cruise', 'Food', 'A relaxed dinner route past illuminated bridges and riverside monuments.', 2.5, 85, 'https://images.unsplash.com/photo-1471623320832-752e8bbf8413?w=600&auto=format&fit=crop&q=80'],
  ['c2222222-2222-4222-8222-222222222222', 'Shibuya Sky & Crossing', 'Sightseeing', 'Open-air observation deck and street-level exploration around Shibuya.', 2, 20, 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&auto=format&fit=crop&q=80'],
  ['c2222222-2222-4222-8222-222222222222', 'Tsukiji Outer Market Food Tour', 'Food', 'Sample seafood, snacks, matcha sweets, and market favorites.', 2.5, 55, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80'],
  ['c3333333-3333-4333-8333-333333333333', 'Colosseum & Roman Forum Tour', 'Culture', 'Walk through the amphitheater and the ruins of ancient civic Rome.', 3, 40, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80'],
  ['c4444444-4444-4444-8444-444444444444', 'Ubud Rice Terrace Walk', 'Adventure', 'A guided morning walk through layered rice fields and village paths.', 2, 18, 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&auto=format&fit=crop&q=80'],
  ['c6666666-6666-4666-8666-666666666666', 'Amber Fort Heritage Exploration', 'Culture', 'Courtyards, mirror work, ramparts, and sweeping views outside Jaipur.', 3.5, 15, 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80'],
];

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);

  await prisma.user.upsert({
    where: { email: 'alex@globetrotter.io' },
    update: { passwordHash },
    create: {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Alex Mercer',
      email: 'alex@globetrotter.io',
      passwordHash,
      phone: '+919876543210',
      role: 'traveler',
    },
  });

  for (const city of cities) {
    await prisma.city.upsert({
      where: { id: city.id },
      update: city,
      create: city,
    });
  }

  for (const [cityId, name, category, description, durationHours, cost, imageUrl] of activities) {
    const existing = await prisma.activity.findFirst({ where: { cityId, name } });
    const payload = { cityId, name, category, description, durationHours, cost, imageUrl };
    if (existing) {
      await prisma.activity.update({ where: { id: existing.id }, data: payload });
    } else {
      await prisma.activity.create({ data: payload });
    }
  }

  const trip = await prisma.trip.upsert({
    where: { id: 'e1111111-1111-4111-8111-111111111111' },
    update: {},
    create: {
      id: 'e1111111-1111-4111-8111-111111111111',
      userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      title: 'Grand European Odyssey',
      description: 'A classical cultural tour across Paris and Rome with historic landmarks and culinary tours.',
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-18'),
      estimatedBudget: 2800,
      isPublic: true,
      shareSlug: 'grand-euro-odyssey-2026',
    },
  });

  await prisma.tripStop.upsert({
    where: { id: 'f1111111-1111-4111-8111-111111111111' },
    update: {},
    create: {
      id: 'f1111111-1111-4111-8111-111111111111',
      tripId: trip.id,
      cityId: 'c1111111-1111-4111-8111-111111111111',
      stopOrder: 1,
      arrivalDate: new Date('2026-09-10'),
      departureDate: new Date('2026-09-14'),
      lodgingCost: 600,
      transportCost: 250,
      notes: 'Hotel near Le Marais',
    },
  });

  await prisma.tripStop.upsert({
    where: { id: 'f2222222-2222-4222-8222-222222222222' },
    update: {},
    create: {
      id: 'f2222222-2222-4222-8222-222222222222',
      tripId: trip.id,
      cityId: 'c3333333-3333-4333-8333-333333333333',
      stopOrder: 2,
      arrivalDate: new Date('2026-09-14'),
      departureDate: new Date('2026-09-18'),
      lodgingCost: 480,
      transportCost: 180,
      notes: 'Boutique stay in Monti',
    },
  });

  const scheduled = [
    ['f1111111-1111-4111-8111-111111111111', 'Eiffel Tower Summit Access', 1, 'Morning', 45, true],
    ['f1111111-1111-4111-8111-111111111111', 'Seine River Dinner Cruise', 2, 'Evening', 85, false],
    ['f2222222-2222-4222-8222-222222222222', 'Colosseum & Roman Forum Tour', 1, 'Morning', 40, false],
  ];

  for (const [tripStopId, customTitle, dayNumber, timeSlot, cost, isCompleted] of scheduled) {
    const existing = await prisma.tripActivity.findFirst({ where: { tripStopId, customTitle, dayNumber } });
    if (!existing) {
      await prisma.tripActivity.create({
        data: { tripStopId, customTitle, dayNumber, timeSlot, cost, isCompleted },
      });
    }
  }

  console.log('Seeded GlobeTrotter data.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
