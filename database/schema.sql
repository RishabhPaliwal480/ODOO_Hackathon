CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS trip_activities CASCADE;
DROP TABLE IF EXISTS trip_stops CASCADE;
DROP TABLE IF EXISTS saved_destinations CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    preferred_currency VARCHAR(10) DEFAULT 'USD',
    role VARCHAR(20) DEFAULT 'traveler',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Cities / Destinations Catalog (Offline searchable)
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    description TEXT,
    cost_index VARCHAR(20) DEFAULT 'Moderate', -- Budget, Moderate, Luxury
    popularity_score INT DEFAULT 85,
    image_url TEXT,
    avg_daily_cost NUMERIC(10, 2) DEFAULT 120.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. City Activities Catalog
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Sightseeing, Food, Adventure, Culture, Leisure
    description TEXT,
    duration_hours NUMERIC(3, 1) DEFAULT 2.0,
    cost NUMERIC(10, 2) DEFAULT 0.00,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Trips Master Table
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    estimated_budget NUMERIC(12, 2) DEFAULT 1500.00,
    cover_image TEXT DEFAULT 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    is_public BOOLEAN DEFAULT FALSE,
    share_slug VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Trip Stops (Multi-city progression)
CREATE TABLE trip_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    city_id UUID REFERENCES cities(id) ON DELETE RESTRICT,
    stop_order INT NOT NULL,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    lodging_cost NUMERIC(10, 2) DEFAULT 0.00,
    transport_cost NUMERIC(10, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Itinerary Day-by-Day Activities
CREATE TABLE trip_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_stop_id UUID REFERENCES trip_stops(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    custom_title VARCHAR(150),
    day_number INT NOT NULL DEFAULT 1,
    time_slot VARCHAR(50) DEFAULT 'Morning', -- Morning, Afternoon, Evening
    cost NUMERIC(10, 2) DEFAULT 0.00,
    is_completed BOOLEAN DEFAULT FALSE,
    notes TEXT
);

-- 7. User Wishlist / Saved Destinations
CREATE TABLE saved_destinations (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, city_id)
);

CREATE INDEX idx_trips_user ON trips(user_id);
CREATE INDEX idx_stops_trip ON trip_stops(trip_id);
CREATE INDEX idx_activities_city ON activities(city_id);