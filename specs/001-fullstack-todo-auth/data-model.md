# Data Model: Full-Stack Todo Web Application

## Entities

### User
**Description**: Represents an authenticated user in the system
**Fields**:
- id: String (primary identifier from Better Auth)
- email: String (unique, required)
- created_at: Timestamp
- updated_at: Timestamp

**Relationships**:
- One-to-many with Task (via user_id foreign key)

**Validation**:
- Email must be valid email format
- Email must be unique across all users

**State Transitions**: None (managed by Better Auth)

### Task
**Description**: Represents a user's task with completion status
**Fields**:
- id: Integer (primary key, auto-increment)
- user_id: String (foreign key to User.id, indexed)
- title: String (required, 1-200 characters)
- description: Text (optional, max 1000 characters)
- completed: Boolean (default: false, indexed)
- created_at: Timestamp
- updated_at: Timestamp

**Relationships**:
- Many-to-one with User (via user_id foreign key)

**Validation**:
- Title is required and must be 1-200 characters
- Description is optional and must be ≤1000 characters
- user_id must reference an existing User

**State Transitions**:
- pending → completed (when task is marked as done)
- completed → pending (when task is marked as undone)

## Indexes

### Required Indexes
- tasks.user_id: Required for efficient user-based filtering
- tasks.completed: Required for efficient status-based filtering
- tasks.created_at: Recommended for sorting by creation date

## Constraints

### Data Integrity
- All tasks must have a valid user_id that references an existing user
- Task titles must be between 1-200 characters
- Task descriptions must be ≤1000 characters if provided

### Security
- Users can only access tasks where user_id matches their authenticated user_id
- No cross-user data access is permitted at the application level