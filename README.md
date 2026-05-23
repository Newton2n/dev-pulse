#  DevPulse : Internal Tech Issue & Feature Tracker



DevPulse is a collaborative platform built for software teams to report bugs, suggest features. It features a  role-based permission system (maintainer ,contributor), secure JWT authentication, and direct raw SQL query integration with PostgreSQL and Neondb. Authorized user can create issue and maintainer can edit,delete that issue and contributor can edit his own issue if that is open status.

**Live Deployment:** https://devpulse-api-iota.vercel.app/

## 🛠️ Tech Stack
* **Runtime:** Node.js (v24.15.0)
* **Language:** TypeScript (Version 6.0.3)
* **Framework:** Express.js (Modular router architecture)
* **Database:** PostgreSQL (Neon DB cloud instance using the native `pg` pool driver with raw SQL queries)
* **Security:** bcrypt (Password hashing) & jsonwebtoken (JWT authentication)

---

## 🚀 Core Features
* **Role-Based Access Control:** Differentiates permissions between `contributor` and `maintainer` roles .
(Authorized user can create any issue and maintainer can update issue and delete .Contributor can update his own issue if thats status is open)

* **Secure Auth:** Protected endpoints requiring verified JWT tokens attached into the authorization header.

---

## 🗄️ Database Schema Summary

### 1. `users` Table
* `id` (Serial, PRIMARY KEY)
* `name` (VARCHAR, Required ,max 50 char)
* `email` (VARCHAR, Unique, Required ,max 50 char)
* `password` (TEXT)
* `role` ('contributor' or 'maintainer', default: 'contributor')
* `created_at` / `updated_at` (Timestamps)

### 2. `issues` Table
* `id` (Serial, PRIMARY KEY)
* `title` (VARCHAR, max 150 chars)
* `description` (TEXT, min 20 chars)
* `type` ('bug' or 'feature_request')
* `status` ('open', 'in_progress', 'resolved', default: 'open')
* `reporter_id` (INT NOT NULL REFERENCES users table id)
* `created_at` / `updated_at` (Timestamps)

---

## 🌐 API Endpoints Summary

### Authentication Module
* `POST /api/auth/signup` - Register a new user (Public route)
* `POST /api/auth/login` - Authenticate user & return JWT token in response (Public route)

### Issues Module
* `POST /api/issues` - Create a bug report or feature request (Authenticated via Authorization headers)
* `GET /api/issues` - Retrieve all issues with reporter details (Public route)
* `GET /api/issues/:id` - Get full details and reporter details of a specific issue (Public rute)
* `PATCH /api/issues/:id` - Update title, description, or type (Conditional access)    

---

## 💻 Local Setup Guide

1. **Clone the repository:**
```
   git clone https://github.com/Newton2n/dev-pulse.git
   cd devpulse
```
2. **install dependencies :**
```
npm install
```

3 .**Configure Environment Variables:**
Create a .env file in the root directory add: 
```
DATABASE_CONNECTION_STRING = neon db connection string 

JWT_SECRET_STRING =jwt secret key
```
4 .**Run the application:**

```
# Development mode
   npm run dev

   # Build and production mode
   npm run build
   npm start
```

Now it should you local computer : http://localhost:5000

If there is any issue related port you can change the PORT variable in server.js file ( const PORT = process.env.PORT || anyother port )

