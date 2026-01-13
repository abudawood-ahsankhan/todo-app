# API Contract: Task Management Service

## Base URL
All endpoints are relative to the base API URL: `/api`

## Authentication
All endpoints (except auth endpoints) require JWT authentication in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Common Response Format

### Success Responses
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Responses
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    },
    "token": "jwt_token"
  }
}
```

#### POST /auth/signin
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    },
    "token": "jwt_token"
  }
}
```

### Task Management

#### GET /tasks
Retrieve all tasks for the authenticated user.

**Query Parameters:**
- `status`: Filter by status ("all", "pending", "completed") - default: "all"
- `sort`: Sort by ("created", "title") - default: "created"

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 1,
        "user_id": "user_id",
        "title": "Task title",
        "description": "Task description",
        "completed": false,
        "created_at": "2023-01-01T00:00:00Z",
        "updated_at": "2023-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### POST /tasks
Create a new task for the authenticated user.

**Request Body:**
```json
{
  "title": "Task title (1-200 chars)",
  "description": "Task description (optional, max 1000 chars)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": "user_id",
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

#### GET /tasks/{id}
Get a specific task for the authenticated user.

**Path Parameters:**
- `id`: Task ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": "user_id",
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

#### PUT /tasks/{id}
Update a specific task for the authenticated user.

**Path Parameters:**
- `id`: Task ID

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated task description"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": "user_id",
    "title": "Updated task title",
    "description": "Updated task description",
    "completed": false,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

#### DELETE /tasks/{id}
Delete a specific task for the authenticated user.

**Path Parameters:**
- `id`: Task ID

**Success Response (204):**
No content returned.

#### PATCH /tasks/{id}/complete
Toggle the completion status of a specific task for the authenticated user.

**Path Parameters:**
- `id`: Task ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": "user_id",
    "title": "Task title",
    "description": "Task description",
    "completed": true,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

## Error Codes

- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Missing or invalid JWT
- `403`: Forbidden - Attempting to access another user's data
- `404`: Not Found - Resource does not exist
- `500`: Internal Server Error - Unexpected server error