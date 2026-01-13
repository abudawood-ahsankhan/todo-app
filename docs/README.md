# Todo Application Documentation

## Overview
This is a full-stack todo web application with authentication and task CRUD operations.

## Features
- User authentication (signup, signin, signout)
- Task management (create, read, update, delete, toggle completion)
- Task filtering and sorting
- JWT-based authentication
- User isolation (each user sees only their tasks)

## Tech Stack
- Frontend: Next.js 16+, TypeScript, Tailwind CSS
- Backend: Python FastAPI, SQLModel
- Database: PostgreSQL
- Authentication: Better Auth with JWT

## API Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/tasks` - Get user's tasks with filtering and sorting
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion

## Environment Variables
- `DATABASE_URL` - Database connection string
- `BETTER_AUTH_SECRET` - JWT secret key

## Running the Application
See quickstart.md for detailed instructions.