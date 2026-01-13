# Quickstart Guide: Full-Stack Todo Web Application

## Prerequisites

- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)
- PostgreSQL client tools
- Git

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd todo-fullstack-web
```

### 2. Install Dependencies

**Backend (Python)**:
```bash
cd backend
pip install -r requirements.txt
```

**Frontend (Node.js)**:
```bash
cd frontend
npm install
```

### 3. Environment Variables

Create `.env` files in both frontend and backend directories with the same `BETTER_AUTH_SECRET`:

**Backend (.env)**:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here
```

**Frontend (.env)**:
```env
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Generate a strong secret with:
```bash
openssl rand -base64 32
```

## Running the Application

### 1. Start the Backend
```bash
cd backend
python main.py
```
Backend will run on `http://localhost:8000`

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

## Key Endpoints

### API Endpoints (Backend)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/tasks` - Get authenticated user's tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion

### Frontend Pages
- `/` - Home page
- `/login` - User login
- `/signup` - User registration
- `/tasks` - Task list page

## Development Workflow

### Backend Development
1. Make changes to Python files
2. Restart the backend server to see changes

### Frontend Development
1. Make changes to TypeScript/JSX files
2. Changes will hot-reload automatically

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Environment Variables for Production
- `DATABASE_URL`: Production database connection string
- `BETTER_AUTH_SECRET`: Production JWT secret
- `NEXT_PUBLIC_API_URL`: Production backend API URL