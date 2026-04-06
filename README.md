# TaskHive

A complete MERN web application with two role-based portals:
- Admin Portal
- Employee Portal

It supports employee registration approval workflow, secure JWT authentication, task assignment, and task progress tracking.

## Features

### Authentication & Authorization
- JWT-based login for admin and employees
- Password hashing using bcrypt
- Default admin account auto-seeded on server startup
- Employees cannot login until admin approval
- Route protection with role-based authorization middleware

### Admin Portal
- Secure login
- View all employee registrations
- Approve or reject employees
- Assign tasks with title, description, deadline
- View all tasks and monitor status progress

### Employee Portal
- Register account (name, email, password)
- Login only after admin approval
- View assigned tasks
- Update task status: Pending, In Progress, Completed

## Project Structure

```text
/project
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Tech Stack

- MongoDB
- Express.js
- React.js (Vite)
- Node.js

## Backend Setup

1. Open terminal in `backend` folder.
2. Install packages:

```bash
npm install
```

3. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

4. Update environment values if needed:
- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

5. Start backend server:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

## Frontend Setup

1. Open terminal in `frontend` folder.
2. Install packages:

```bash
npm install
```

3. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

4. Start frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Default Admin Credentials

The backend auto-creates admin on first startup using env values:
- Email: `admin@taskms.com`
- Password: `Admin@123`

You can override via environment variables in backend `.env`.

## API Summary

### Auth APIs
- `POST /api/auth/register` - Register employee
- `POST /api/auth/login` - Login admin/employee

### Admin APIs (Admin JWT required)
- `GET /api/admin/employees` - List employees
- `PATCH /api/admin/employees/:employeeId/status` - Approve/reject employee
- `POST /api/admin/tasks` - Assign task
- `GET /api/admin/tasks` - List all tasks

### Employee APIs (Employee JWT required)
- `GET /api/employee/tasks` - List assigned tasks
- `PATCH /api/employee/tasks/:taskId/status` - Update task status

## Security

- JWT token auth
- bcrypt password hashing
- role-based middleware
- express-validator input validation
- helmet and CORS hardening
- centralized error handling

## Notes

- Ensure MongoDB is running before backend startup.
- Employee accounts are created with `pending` status and require admin action.
- Task status colors in dashboards:
  - Pending (yellow)
  - In Progress (blue)
  - Completed (green)
"# Xplore-Intellects-Pvt-Ltd" 
