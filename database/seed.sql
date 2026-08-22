-- Default User
INSERT INTO users (id, name, email, password_hash, phone, role)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alex Mercer', 'alex@globetrotter.io', '\$2a\$12\$qJH8EenWuEdJwMSn18NrxuogBmZkdNa/Y9RD1l/EZ2U/TKZfcQi76', '+919876543210', 'traveler')
ON CONFLICT (id) DO NOTHING;

-- Seed Global Destinations
INSERT INTO cities (id, name, country, region, description, cost_index, popularity_score, avg_daily_cost, image_url)
VALUES 
    ('c1111111-1111-4111-8111-111111111111', 'Paris', 'France', 'Europe', 'The City of Light known for art, fashion, gastronomy, and the iconic Eiffel Tower.', 'Luxury', 98, 180.00, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600'),
    ('c2222222-2222-4222-8222-222222222222', 'Tokyo', 'Japan', 'Asia', 'Dynamic blend of ultramodern neon skyscrapers and historic Shinto shrines.', 'Moderate', 96, 140.00, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600'),
    ('c3333333-3333-4333-8333-333333333333', 'Rome', 'Italy', 'Europe', 'Centuries of monumental history, Colosseum, Vatican, and world-class cuisine.', 'Moderate', 94, 130.00, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600'),
    ('c4444444-4444-4444-8444-444444444444', 'Bali', 'Indonesia', 'Southeast Asia', 'Tropical paradise renowned for volcanic mountains, beaches, and coral reefs.', 'Budget', 92, 50.00, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600'),
    ('c5555555-5555-4555-8555-555555555555', 'New York', 'United States', 'North America', 'The bustling metropolis of culture, Broadway theater, Central Park, and skyline.', 'Luxury', 97, 220.00, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600'),
    ('c6666666-6666-4666-8666-666666666666', 'Jaipur', 'India', 'South Asia', 'The Pink City famous for majestic forts, royal palaces, and vibrant heritage.', 'Budget', 89, 45.00, 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600')
ON CONFLICT (id) DO NOTHING;

-- Seed Activities
INSERT INTO activities (city_id, name, category, description, duration_hours, cost, image_url)
VALUES 
    ('c1111111-1111-4111-8111-111111111111', 'Eiffel Tower Summit Access', 'Sightseeing', 'Enjoy panoramic views from the topmost deck of the Eiffel Tower.', 3.0, 45.00, 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400'),
    ('c1111111-1111-4111-8111-111111111111', 'Louvre Museum Guided Walk', 'Culture', 'Explore masterworks including Mona Lisa and Venus de Milo.', 3.5, 30.00, 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400'),
    ('c1111111-1111-4111-8111-111111111111', 'Seine River Dinner Cruise', 'Food', 'Gourmet 3-course French dining gliding past illuminated monuments.', 2.5, 85.00, 'https://images.unsplash.com/photo-1471623320832-752e8bbf8413?w=400'),
    ('c2222222-2222-4222-8222-222222222222', 'Shibuya Sky & Crossing', 'Sightseeing', '360-degree open-air observation deck overlooking Tokyo.', 2.0, 20.00, 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400'),
    ('c2222222-2222-4222-8222-222222222222', 'Tsukiji Outer Market Food Tour', 'Food', 'Sample fresh sashimi, wagyu beef skewers, and matcha sweets.', 2.5, 55.00, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400'),
    ('c3333333-3333-4333-8333-333333333333', 'Colosseum & Roman Forum Tour', 'Culture', 'Walk through the gladiatorial arena and ruins of ancient Rome.', 3.0, 40.00, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400'),
    ('c6666666-6666-4666-8666-666666666666', 'Amber Fort Heritage Exploration', 'Culture', 'Magnificent hilltop fort with grand courtyards and Sheesh Mahal.', 3.5, 15.00, 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400');

-- Seed Sample Trip (European Explorer)
INSERT INTO trips (id, user_id, title, description, start_date, end_date, estimated_budget, is_public, share_slug)
VALUES (
    'e1111111-1111-4111-8111-111111111111',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Grand European Odyssey',
    'A classical cultural tour across Paris and Rome with historic landmarks and culinary tours.',
    '2026-09-10',
    '2026-09-18',
    2800.00,
    TRUE,
    'grand-euro-odyssey-2026'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Stops for Sample Trip
INSERT INTO trip_stops (id, trip_id, city_id, stop_order, arrival_date, departure_date, lodging_cost, transport_cost, notes)
VALUES 
    ('f1111111-1111-4111-8111-111111111111', 'e1111111-1111-4111-8111-111111111111', 'c1111111-1111-4111-8111-111111111111', 1, '2026-09-10', '2026-09-14', 600.00, 250.00, 'Hotel near Le Marais'),
    ('f2222222-2222-4222-8222-222222222222', 'e1111111-1111-4111-8111-111111111111', 'c3333333-3333-4333-8333-333333333333', 2, '2026-09-14', '2026-09-18', 480.00, 180.00, 'Boutique stay in Monti')
ON CONFLICT (id) DO NOTHING;

-- Seed Scheduled Activities
INSERT INTO trip_activities (trip_stop_id, custom_title, day_number, time_slot, cost, is_completed)
VALUES 
    ('f1111111-1111-4111-8111-111111111111', 'Eiffel Tower Summit Access', 1, 'Morning', 45.00, TRUE),
    ('f1111111-1111-4111-8111-111111111111', 'Seine River Dinner Cruise', 2, 'Evening', 85.00, FALSE),
    ('f2222222-2222-4222-8222-222222222222', 'Colosseum & Roman Forum Tour', 1, 'Morning', 40.00, FALSE);