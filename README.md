# FirstShift — Internship & Early-Career Job Portal

A modern, full-stack recruitment portal built specifically for students and recent graduates searching for internships and entry-level positions. Features high-clarity listings with upfront pay, deadlines, and locations, an application workflow, candidate review console, and secure admin management.

---

## 🏗️ Architecture & Tech Stack

The project follows a clean monorepo architecture:

- **Frontend (`client/`)**:
  - React 19 + TypeScript + Vite
  - React Router DOM (v7)
  - Tailwind CSS (v4) with custom theme tokens & neo-brutal aesthetics
  - Radix UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`)
  - Sonner toast notifications & Lucide React icons
  - Axios API client with automatic JWT bearer authorization

- **Backend (`server/`)**:
  - Node.js & Express (ES Modules)
  - MongoDB & Mongoose ODM
  - JWT Authentication + bcrypt password hashing + httpOnly cookie support
  - Express-Validator for input validation & sanitization
  - CORS, rate-limiting, and centralized error handling

---

## 📁 Project Structure

```text
FirstShift/
├── client/                         # React frontend (Vite + Tailwind v4)
│   ├── public/                     # Favicons and static assets
│   ├── src/
│   │   ├── assets/                 # Hero imagery
│   │   ├── components/             # Reusable UI components
│   │   │   ├── common/             # Common elements
│   │   │   ├── forms/              # ApplicationForm & OpportunityForm
│   │   │   ├── layout/             # Layout pieces
│   │   │   ├── opportunities/      # Card views, filters & search
│   │   │   ├── ui/                 # Radix dialogs & toasts
│   │   │   ├── brand.tsx           # Brand headers, footers, buttons
│   │   │   └── mobile.tsx          # Mobile navigation & touch swipe
│   │   ├── context/                # AuthContext & SavedContext
│   │   ├── pages/                  # Page routes
│   │   ├── services/               # API service layer (Axios)
│   │   ├── utils/                  # Formatting & style utilities
│   │   ├── routes/                 # AppRoutes definitions
│   │   ├── App.tsx                 # Root layout & providers
│   │   ├── main.tsx                # Client entry point
│   │   └── index.css               # Design system & Tailwind v4 styles
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── server/                         # Node/Express backend
│   ├── src/
│   │   ├── config/                 # Database configuration (db.js)
│   │   ├── controllers/            # Opportunity, Application & Auth controllers
│   │   ├── middleware/             # Auth, error handling, notFound
│   │   ├── models/                 # Mongoose schemas (Opportunity, Application, Admin)
│   │   ├── routes/                 # REST API routes
│   │   ├── validators/             # Express-validator schema rules
│   │   ├── utils/                  # apiResponse formatting
│   │   ├── app.js                  # Express middleware setup
│   │   ├── server.js               # Server bootstrap & MongoDB connection
│   │   └── seed.js                 # Database seeder with sample opportunities
│   ├── .env.example
│   └── package.json
│
├── doc/                            # Architecture & requirements specifications
├── .gitignore
├── README.md
└── package.json                    # Root scripts for client & server
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** >= 18
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

### 2. Environment Setup

**Backend (`server/.env`):**
```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/firstshift
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=super_secret_jwt_key_firstshift_2026
ADMIN_EMAIL=admin@firstshift.dev
ADMIN_PASSWORD=admin123
```

**Frontend (`client/.env`):**
```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Installation

Run from root:
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 4. Seed Database

Populate initial opportunities and create the default admin account:
```bash
cd server
npm run seed
```

### 5. Running the Application

In two separate terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Frontend starts on http://localhost:5173
```

---

## 🔑 Default Admin Credentials

- **Email**: `admin@firstshift.dev`
- **Password**: `admin123`
- **Console URL**: `http://localhost:5173/admin-login`

---

## 🔌 API Endpoints

### Opportunities (`/api/opportunities`)
- `GET /` — List opportunities with search, domain, type, work mode, and location filters
- `GET /:id` — Get single opportunity by ID
- `POST /` — Create opportunity *(Admin only)*
- `PATCH /:id` — Update opportunity *(Admin only)*
- `DELETE /:id` — Delete opportunity *(Admin only)*

### Applications (`/api/applications`)
- `POST /` — Submit a candidate application (validated)
- `GET /` — List applications *(Admin only)*
- `PATCH /:id/status` — Update application status (`New` | `Reviewing` | `Shortlisted` | `Rejected`) *(Admin only)*

### Authentication (`/api/auth`)
- `POST /login` — Admin sign-in, returns JWT and sets httpOnly cookie
- `POST /logout` — Admin logout, clears session
- `GET /me` — Returns current authenticated admin profile

---

## 📄 License
MIT
