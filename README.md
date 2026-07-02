Store Rating Platform
A full-stack web app using the tech stack  : ExpressJS + MySQL + ReactJS. Users can rate stores from 1-5, with role-based access for System Administrators, Normal Users, and Store Owners.

Folder Structure:
roxiler-app/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # Sequelize MySQL connection
│   │   ├── models/                # User, Store, Rating + associations
│   │   ├── middleware/auth.js     # JWT authenticate + role authorize
│   │   ├── controllers/           # Business logic per role
│   │   ├── routes/                # Express routers
│   │   ├── utils/validators.js    # Name/email/password/rating validation
│   │   ├── app.js                 # Express app + route mounting
│   │   └── server.js              # Entry point, DB connect + listen
│   ├── seed.sql                   # Schema + default admin account
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js           # Axios instance with JWT interceptor
    │   ├── context/AuthContext.jsx
    │   ├── components/            # Navbar, ProtectedRoute, StarRating
    │   ├── pages/                 # Login, Signup, Admin*, Stores, etc.
    │   ├── App.jsx                # Routes
    │   └── main.jsx
    ├── vite.config.js
    └── package.json


Prerequisites
- Node.js 
- MySQL Server 
- npm

Validation Rules
- Name: 20-60 characters
- Address: max 400 characters
- Password: 8-16 characters, at least 1 uppercase letter + 1 special character
- Email: standard email format
- Rating: integer 1-5


1. Database Setup

Log in to MySQL and run the seed script to create the database and a default admin account:

mysql -u root -p < backend/seed.sql


This creates:
- Database `storeDB`
- Tables `users`, `stores`, `ratings` with proper foreign keys and constraints
- A default admin account:
  - Email: `admin@roxiler.com`
  - Password: `Admin@1234`

> Note: The backend also auto-syncs the schema with Sequelize on startup (`sequelize.sync({ alter: true })`), so even if you skip the SQL file, tables will be created automatically. Running `seed.sql` is recommended mainly to get the default admin account.


2. Backend Setup

cd backend
npm install
cp .env.example .env

Edit `.env` with your MySQL credentials:

PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=storeDB
DB_USER=root
DB_PASSWORD=mysql_password
JWT_SECRET=replace long_random_string
JWT_EXPIRES_IN=7d
```

Start the backend server:

npm run dev

You should see:
Database connection established successfully.
Models synced with database.
Server running on http://localhost:5000

Test it: `curl http://localhost:5000/api/health` → `{"status":"ok"}`


3. Frontend Setup

Open a new terminal:

cd frontend
npm install
npm run dev

The app will run on `http://localhost:3000`. API calls to `/api/*` are proxied to `http://localhost:5000` (configured in `vite.config.js`), so no CORS issues during development.

4. Using the App

1. Open `http://localhost:3000`
2. Log in as admin (`admin@roxiler.com` / `Admin@1234`) to:
   - View the dashboard (total users, stores, ratings)
   - Add new users (Admin / Normal User / Store Owner) — assign role at creation
   - Add new stores and optionally assign a Store Owner to them
   - Browse/filter/sort users and stores
3. Sign up as a Normal User (`/signup`) to:
   - Browse all stores, search by name/address
   - Submit and update a 1-5 rating per store
4. Log in as a Store Owner to:
   - View the dashboard for the assigned store: average rating + list of users who rated it

All roles can update their password from the navbar.

API Overview
POST: `/api/auth/signup` 
POST: `/api/auth/login` 
PUT: `/api/auth/update-password` 
GET: `/api/admin/dashboard` 
POST: `/api/admin/users` 
GET: `/api/admin/users`
GET: `/api/admin/users/:id` 
POST: `/api/admin/stores` 
GET: `/api/admin/stores` 
GET: `/api/stores` 
POST: `/api/stores/:storeId/rating` 
PUT: `/api/stores/:storeId/rating` 
GET: `/api/store-owner/dashboard` 
