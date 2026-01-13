---
id: 2
title: Create Fullstack Todo Auth Spec
stage: spec
date: 2026-01-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: fullstack-todo-auth
branch: 1-fullstack-todo-auth
user: Claude Code
command: sp.specify
labels: [spec, authentication, crud, todo-app]
links:
  spec: specs/1-fullstack-todo-auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/1-fullstack-todo-auth/spec.md
 - specs/1-fullstack-todo-auth/checklists/requirements.md
tests:
 - none
---

## Prompt

```text
# /sp.specify — Complete Feature Specification for Phase II: Full-Stack Todo Web Application

This specification defines **exactly what must be built** for Phase II of the Hackathon Todo App. All agents (SpecValidator, FullstackIntegratorAgent, and subagents) must implement this precisely, without adding or removing functionality unless explicitly approved.

## Feature Set
Implement the following **two core features** with full end-to-end functionality:

1. **User Authentication** – Signup and Sign-in with secure multi-user support
2. **Task CRUD Operations** – Create, read, update, delete, and toggle completion of tasks, fully isolated per user

## 1. User Authentication

### User Stories
- As a visitor, I can sign up with email and password so that I have a personal account.
- As a visitor, I can sign in with email and password to access my tasks.
- As an authenticated user, I remain logged in across page refreshes (via Better Auth session + JWT).
- As an unauthenticated user, I am redirected to sign-in when trying to access protected pages.
- As an authenticated user, I can sign out.

### Acceptance Criteria
- Uses **Better Auth** with JWT plugin enabled.
- Shared `BETTER_AUTH_SECRET` environment variable between frontend and backend.
- On successful signup/signin → Better Auth issues JWT containing `user.id` (as `sub` claim).
- JWT attached to every API request via `Authorization: Bearer <token>` header.
- Backend verifies JWT on every protected request → extracts authenticated `user_id`.
- All API responses and database queries filtered strictly by this `user_id`.
- Invalid/missing JWT → 401 Unauthorized.
- Users table fully managed by Better Auth (no manual schema changes).

## 2. Task CRUD Operations

### User Stories
- As an authenticated user, I can create a new task with a title and optional description.
- As an authenticated user, I can view a list of only my tasks.
- As an authenticated user, I can view details of one of my tasks.
- As an authenticated user, I can update the title or description of my task.
- As an authenticated user, I can delete one of my tasks.
- As an authenticated user, I can toggle a task between pending and completed.

### Acceptance Criteria
#### Data Model (Tasks)
- `id`: Integer primary key
- `user_id`: String (foreign key to Better Auth users.id) – **required**
- `title`: String (required, 1–200 characters)
- `description`: Text (optional, max 1000 characters)
- `completed`: Boolean (default: false)
- `created_at`: Timestamp
- `updated_at`: Timestamp
- Optional future field: `due_date` (for sorting – add only if sorting requires it)

#### API Endpoints (All under /api/tasks — NO {user_id} in path)
| Method | Endpoint                  | Description                          | Auth Required | Body / Query Params                                      | Success Response |
|--------|---------------------------|--------------------------------------|---------------|----------------------------------------------------------|------------------|
| GET    | `/api/tasks`              | List user's tasks                    | Yes           | Query: `status` ("all"|"pending"|"completed"), `sort` ("created"|"title") | 200 + array of tasks |
| POST   | `/api/tasks`              | Create new task                      | Yes           | { title: string (req), description: string (opt) }       | 201 + created task |
| GET    | `/api/tasks/{id}`         | Get single task details              | Yes           | Path: id                                                 | 200 + task       |
| PUT    | `/api/tasks/{id}`         | Update task                          | Yes           | { title?: string, description?: string }                 | 200 + updated task |
| DELETE | `/api/tasks/{id}`         | Delete task                          | Yes           | -                                                        | 204 No Content   |
| PATCH  | `/api/tasks/{id}/complete`| Toggle completion                    | Yes           | -                                                        | 200 + updated task |

- **All endpoints** enforce ownership: only tasks where `tasks.user_id == authenticated_user_id` are accessible/modifiable.
- Attempting to access/modify another user's task → 404 Not Found or 403 Forbidden.

#### Frontend Requirements
- Responsive UI built with Next.js 16+ App Router, TypeScript, Tailwind CSS.
- Protected routes: task list, create, edit pages require authentication.
- Task list page:
  - Displays title, status (pending/completed), created date
  - Filter by status
  - Sort by created date or title
  - Buttons/actions: create new, edit, delete, toggle complete
- Forms: validation for required title, character limits
- All API calls via centralized `/lib/api.ts` with automatic JWT attachment
- Loading and error states handled gracefully

## Non-Functional Requirements
- **Security**: Full user isolation enforced at database/backend level via JWT.
- **Performance**: Indexes on `tasks.user_id` and `tasks.completed`.
- **Stateless**: No shared session storage beyond JWT.
- **Development Workflow**: All implementation driven from this specification and existing `/specs/` files.
- **Agents**: FullstackIntegratorAgent must coordinate SpecValidator → DatabaseAgent → AuthAgent → BackendAgent → FrontendAgent.

## Out of Scope for Phase II
- Social login (Google, GitHub)
- Password reset
- Task due dates (unless required for sorting)
- Advanced filtering/sorting beyond specified
- AI chatbot features (reserved for Phase III)

This specification is complete and authoritative for Phase II. All code, plans, and agent actions must align exactly with these requirements.
```

## Response snapshot

Created a comprehensive feature specification for the full-stack todo web application with authentication. The spec includes:

1. Detailed user stories prioritized by importance (authentication as P1, task CRUD as P2, filtering/sorting as P3)
2. Clear acceptance scenarios for each user story
3. Identified edge cases for robust implementation
4. 16 functional requirements covering authentication, task operations, security, and UI
5. Defined key entities (User and Task)
6. Established 7 measurable success criteria focusing on performance, reliability, and user experience

Also created a quality checklist to validate the specification completeness.

## Outcome

- ✅ Impact: Created complete feature specification for fullstack todo app with authentication
- 🧪 Tests: none
- 📁 Files: Created spec.md and requirements checklist
- 🔁 Next prompts: Ready for planning phase (/sp.plan)
- 🧠 Reflection: The specification captures all essential elements for the fullstack todo application with strong focus on user authentication and task management capabilities.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A