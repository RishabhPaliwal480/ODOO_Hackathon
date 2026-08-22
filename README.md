# GlobeTrotter

![GlobeTrotter Banner](https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80)

GlobeTrotter is a travel planning and management platform designed to help users organize their journeys in one place. It is a modern, full-stack travel planning application designed to deliver an end-to-end journey creation experience. From real-time destination discovery and drag-and-drop itinerary building to comprehensive budget tracking, community trip cloning, and calendar sync — GlobeTrotter simplifies complex travel workflows into an intuitive, glassmorphic UI.



## Problem

Planning a trip often involves using multiple platforms for searching destinations, organizing travel plans, managing itineraries, tracking budgets, and keeping important trip information together. This can make the travel planning process confusing and difficult to manage.

## Solution

GlobeTrotter provides a centralized platform where users can explore destinations, create trips, manage travel plans, and organize itineraries through a simple and user-friendly interface.

The platform aims to make travel planning more organized, accessible, and efficient by bringing different parts of the journey planning process into one system.

## Key Features

- Create and manage multiple trips
- Explore and search for travel destinations
- Build and organize travel itineraries
- View detailed trip information
- Track estimated travel budgets
- Manage travel plans through a personalized dashboard
- Organize trips using a calendar view
- Access community and travel-related features
- Manage user profiles
- View travel insights and analytics

## Project Goal

The goal of GlobeTrotter is to simplify the travel planning experience by providing a single platform for discovering destinations, planning journeys, organizing itineraries, and managing travel information.

## 🎥 Demo Video

> See GlobeTrotter in action — from destination discovery to trip planning and itinerary management.
Watch the Demo Video -> https://youtu.be/de8nGkv9nOI

# GlobeTrotter — Smart Travel Planning & Itinerary Platform

![GlobeTrotter Banner](https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80)

> **GlobeTrotter** 

---

## Module Overview

| Module | Capabilities |
| :--- | :--- |
| **Authentication & Security** | JWT-based auth with refresh persistence, password hashing with `bcryptjs` (12 rounds), protected routes, and role-based access control (`admin` / `traveler`). |
| **Hero & City Discovery** | Cinematic looping video background, live city & attraction search with cost estimates, weather data, and regional category filtering. |
| **Itinerary Builder** | Day-by-day stop management, drag-and-drop/timeline activity sequencing, custom activity pricing, and live total calculation. |
| **Budget & Cost Breakdown** | Real-time budget tracking vs. actual spending, categorical cost breakdowns (lodging, transit, activities), and deficit alerts. |
| **Trip Calendar & Timeline** | Interactive calendar grid visualizing active, past, and upcoming journeys with multi-day itinerary spans. |
| **Community Feed & 1-Click Fork** | Public itinerary exploration with 1-click trip cloning/copying directly into your personal dashboard. |
| **User Profile & Favorites** | Profile management, favorite city bookmarks, and currency/travel preference personalization. |
| **Admin & Telemetry API** | System-wide analytics endpoints aggregating platform metrics, total trips created, revenue volume, and active user metrics. |

---

## Tech Stack & Architecture

### **Frontend (`/client`)**
- **Framework:** React 19 (SPA Architecture)
- **Tooling & Bundler:** Vite 7
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** Custom Glassmorphism Design System + Tailwind CSS
- **Icons:** Lucide React (`lucide-react`)
- **State & Context:** React Context API (`AuthContext`, `ToastContext`)
- **Testing:** Vitest + React Testing Library + JSDOM

### **Backend (`/server`)**
- **Runtime & Framework:** Node.js + Express
- **Database & ORM:** PostgreSQL + Prisma ORM (7 relational models)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`
- **Security & Headers:** `helmet`, `cors`, `express-rate-limit`
- **Validation:** `express-validator` middleware
- **Logging & Compression:** `morgan`, `compression`

---

## Database Schema Overview (Prisma)

```mermaid
erDiagram
    User ||--o{ Trip : creates
    User ||--o{ SavedDestination : bookmarks
    City ||--o{ Activity : contains
    City ||--o{ SavedDestination : saved_by
    City ||--o{ TripStop : host_city
    Trip ||--o{ TripStop : contains
    TripStop ||--o{ TripActivity : schedules
    Activity ||--o{ TripActivity : referenced_in

    User {
        string id PK
        string email UK
        string name
        string role
        string password
    }
    Trip {
        string id PK
        string userId FK
        string title
        float budget
        string status
        boolean isPublic
        string shareSlug UK
    }
    TripStop {
        string id PK
        string tripId FK
        string cityId FK
        int stopOrder
        datetime arrivalDate
    }
    TripActivity {
        string id PK
        string tripStopId FK
        string activityId FK
        float cost
        boolean isCompleted
    }
```

---

## Quick Start & Local Setup

### **Prerequisites**
- **Node.js**: `v18+` or `v20+`
- **npm**: `v9+`
- **PostgreSQL Database** running locally or on the cloud (Neon, Supabase, Railway, etc.)

---

### **1. Clone & Install Dependencies**
```bash
# Clone the repository
git clone https://github.com/RISHI5991/GlobeTrotter.git
cd GlobeTrotter

# Install root, server, and client dependencies concurrently
npm install
```

---

### **2. Configure Environment Variables**

Create `server/.env`:
```env
PORT=5001
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/globetrotter?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
```

Create `client/.env` (optional, defaults to `http://localhost:5001/api`):
```env
VITE_API_URL="http://localhost:5001/api"
```

---

### **3. Initialize Database & Seed Demo Data**
```bash
# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with demo user, 6 top world cities, and curated activities
npm run db:seed
```

#### **Default Demo Credentials:**
- **Email:** `alex@globetrotter.io`
- **Password:** `password123`

---

### **4. Run the Full Stack Application**

```bash
# Starts both frontend (port 5173) and backend (port 5001) concurrently
npm run dev
```

- **Frontend URL:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5001/api](http://localhost:5001/api)
- **API Healthcheck:** [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## REST API Reference

### **Auth Endpoints**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate & receive JWT | No |
| `GET` | `/api/auth/me` | Fetch active user session | Yes (`Bearer Token`) |

### **Trips & Itinerary Endpoints**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/trips` | List current user's trips | Yes |
| `POST` | `/api/trips` | Create a new trip | Yes |
| `GET` | `/api/trips/:id` | Get trip with full stops & activities | Yes |
| `PATCH` | `/api/trips/:id` | Update trip details or status | Yes |
| `DELETE` | `/api/trips/:id` | Delete trip (cascade deletes stops) | Yes |
| `GET` | `/api/trips/public/feed` | List community public itineraries | No |
| `POST` | `/api/trips/copy/:id` | Clone public trip to current account | Yes |
| `POST` | `/api/itinerary/stops` | Add a stop to a trip | Yes |
| `DELETE` | `/api/itinerary/stops/:id` | Remove a stop from a trip | Yes |
| `POST` | `/api/itinerary/activities`| Add activity to stop | Yes |
| `DELETE` | `/api/itinerary/activities/:id`| Remove activity | Yes |

### **Cities & Activities Endpoints**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cities` | Search and filter destination cities | No |
| `GET` | `/api/cities/:id` | Get city details and popular attractions | No |
| `GET` | `/api/cities/activities/search` | Search activity catalog by tag/budget | No |

---

## Testing & Verification

```bash
# Run client unit tests (Vitest)
npm run test --workspace client

# Build frontend for production
npm run build
```

---

## Repository Structure

```text
GlobeTrotter/
├── client/                     # React Frontend SPA
│   ├── public/                 # Static assets & Hero video (219300.mp4)
│   ├── src/
│   │   ├── components/         # Reusable glassmorphic UI components
│   │   │   ├── hero/           # Hero section & media controls
│   │   │   ├── itinerary/      # Timeline, stops, and activities
│   │   │   ├── modals/         # Auth, contact, and share modals
│   │   │   └── navigation/     # Floating navbar & screen navigator
│   │   ├── context/            # Global Auth & Toast state providers
│   │   ├── pages/              # 10 core application views
│   │   ├── services/           # Axios/Fetch API client abstractions
│   │   ├── styles/             # Design tokens & glassmorphism CSS
│   │   ├── App.jsx             # Top-level routing & layout shell
│   │   └── main.jsx            # React root mount
│   └── vite.config.js          # Vite build & test configuration
│
├── server/                     # Express REST API Server
│   ├── config/                 # Prisma client & database configuration
│   ├── controllers/            # Controller business logic
│   ├── middleware/             # JWT auth guard, validators, error handlers
│   ├── prisma/                 # PostgreSQL schema definition & seeds
│   ├── routes/                 # Express route definitions
│   ├── utils/                  # Currency, slug, and formatter helpers
│   ├── app.js                  # Express middleware setup
│   └── server.js               # Server entry point
│
├── package.json                # Monorepo NPM workspace configuration
└── README.md                   # Project documentation
```

---

## Security Best Practices Implemented

- **Password Security:** Salted and hashed using `bcryptjs` (Cost factor: 12).
- **JWT Protection:** Short-lived signed tokens; authorization checked on every private endpoint.
- **Data Isolation:** Cascade deletion and ownership verification for all user itineraries and stops.
- **Injection Protection:** Parameterized SQL queries via Prisma ORM.
- **Server Hardening:** HTTP headers secured using `helmet` and static assets safely scoped.

---
