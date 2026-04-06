# TaskHive

TaskHive is a responsive MERN application for admin-controlled employee onboarding and task management. It includes a secure approval workflow, role-based dashboards, task assignment, task progress tracking, and a polished glassmorphism UI built for desktop, tablet, and mobile layouts.

## Overview

The system has two portals:
- Admin Portal
- Employee Portal

Admin users can review registrations, approve or reject employees, assign tasks, and monitor task progress.

Employees can register, wait for approval, log in after approval, view assigned tasks, and update task status.

## Key Features

### Authentication & Access Control
- JWT-based authentication for admin and employee accounts
- Employee registration with pending approval status
- Admin approval workflow before employee login is allowed
- Protected routes based on user role
- Password hashing with bcrypt

### Admin Portal
- Top navigation bar with Dashboard, Employee Management, and Task Overview links
- Profile dropdown on the right side
- Analytics cards for employee and task counts
- Clean employee registration list with initials avatars and status badges
- Approve and reject actions with compact icon buttons
- Task assignment card with priority selection
- Kanban-style task overview for Pending, In Progress, and Completed tasks

### Employee Portal
- Top navigation bar with dashboard sections
- Task summary cards
- Responsive task board grouped by status
- Status updates for assigned tasks
- Clean, mobile-friendly layout

### UI and UX
- Glassmorphism cards and soft shadows
- Teal and dark green professional theme
- Fully responsive layouts for mobile, tablet, and desktop
- Custom animated TaskHive brand title
- Background particle animation on auth pages

## Technology Stack

### Core Stack
- MongoDB
- Express.js
- React.js
- Node.js

### Supporting Frontend Tools
- React Router
- Axios
- Vite
- Custom CSS

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

## Installation

### 1. Backend Setup

Open a terminal in the `backend` folder and install the backend dependencies:

```bash
npm install
```

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Update the environment variables if needed:
- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Start the backend server:

```bash
npm run dev
```

Backend runs on:
- `http://localhost:5000`

### 2. Frontend Setup

Open a terminal in the `frontend` folder and install the frontend dependencies:

```bash
npm install
```

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Start the frontend app:

```bash
npm run dev
```

Frontend runs on:
- `http://localhost:5173`

## Database Setup and Future MongoDB Atlas Plan

TaskHive currently uses a local MongoDB database for development and testing. MongoDB Atlas is planned for future enhancements and deployment workflows, but it is not required for the current setup.

### Current local setup
- Run MongoDB locally on your machine.
- Keep `MONGO_URI` pointing to your local MongoDB instance.
- Use the backend `.env` file to store the local connection string.

### Future Atlas enhancement plan
- Create a MongoDB Atlas cluster when you are ready to move to cloud hosting.
- Create a database user with a strong password.
- Add your deployment IP address or allow access from the hosting environment.
- Replace the local `MONGO_URI` with the Atlas connection string.

### Environment values to update for future deployment
- `MONGO_URI` can later point to your Atlas cluster.
- `JWT_SECRET` should be a strong, unique secret.
- `CLIENT_URL` should match the deployed frontend URL.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` should be changed if you want a different default admin account.

### Example Atlas connection string for future use
```bash
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/xplore_intellects?retryWrites=true&w=majority
```

### Future deployment checklist
- Keep `MONGO_URI` in your deployment platform's environment variables, not in the frontend code.
- Make sure the backend can reach Atlas over the network.
- Verify the database name matches the one used by the app.
- Confirm the backend starts successfully before connecting the frontend.
- If you move the frontend to a deployed domain, update the backend CORS and client URL settings together.

## Default Admin Credentials

The backend auto-creates the default admin account on startup using the values defined in the backend `.env` file.

Default credentials:
- Email: `admin@taskms.com`
- Password: `Admin@123`

You can change these values in the backend environment file if needed.

## Sample Employee Login

For quick testing and demo purposes, you can use this sample employee account after it has been created and approved in the system:

- Name: `employee1`
- Email: `employee123@gmail.com`
- Password: `employee123`

If you use a different employee record in your database, update these credentials accordingly.

## API Summary

### Auth APIs
- `POST /api/auth/register` - Register a new employee
- `POST /api/auth/login` - Login as admin or employee

### Admin APIs
- `GET /api/admin/employees` - View employee registrations
- `PATCH /api/admin/employees/:employeeId/status` - Approve or reject an employee
- `POST /api/admin/tasks` - Assign a new task
- `GET /api/admin/tasks` - View all tasks

### Employee APIs
- `GET /api/employee/tasks` - View assigned tasks
- `PATCH /api/employee/tasks/:taskId/status` - Update task status

## Security

- JWT authentication
- Role-based route protection
- bcrypt password hashing
- express-validator input validation
- helmet and CORS hardening
- Centralized error handling

## Responsive Layout Notes

The UI is designed to work across multiple screen sizes:
- Mobile-first responsive dashboards
- Stacked layouts on smaller screens
- Horizontal navigation collapse behavior on tablet and mobile
- Glass cards and compact form sections that scale cleanly

## Notes

- For local development, make sure MongoDB is running before starting the backend.
- MongoDB Atlas is reserved for future enhancements and cloud deployment.
- Employee accounts are created with `pending` status and must be approved by an admin before login.
- The frontend uses custom CSS rather than Tailwind CSS.
