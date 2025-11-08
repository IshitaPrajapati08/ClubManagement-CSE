# Clubflow Backend

This folder contains a minimal Node + Express + MongoDB backend for the Clubflow frontend.

Quick start

1. Copy `.env.example` to `.env` and fill in `MONGODB_URI` and `JWT_SECRET`.

2. Install dependencies (from repository root or backend folder):

```cmd
cd "c:\Users\ishit\OneDrive\Desktop\New folder\clubflow-blue\backend"
npm install
```

3. Start the server:

```cmd
npm run dev
# or
npm start
```

The server exposes these endpoints (all under `/api`):

- POST `/api/auth/signup` { name, email, password, role, department }
- POST `/api/auth/login` { email, password }
- GET `/api/clubs`
- POST `/api/clubs`
- PUT `/api/clubs/:id`
- DELETE `/api/clubs/:id`
- GET `/api/events`
- POST `/api/events`
- PUT `/api/events/:id`
- DELETE `/api/events/:id`
- GET `/api/join-requests`
- POST `/api/join-requests`
- PUT `/api/join-requests/:id`
- GET `/api/registrations`
- POST `/api/registrations`

Notes

- The backend returns documents with MongoDB `_id` fields; the frontend maps `_id` to `id` where needed.
- Authentication uses JWT; the frontend stores the token in `localStorage.token` and sends it as `Authorization: Bearer <token>` when present.
- This is a minimal scaffold intended to be extended (validation, error handling, role-based access, input sanitization, unit tests, etc.).
