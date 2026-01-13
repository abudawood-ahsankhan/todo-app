---
id: 3
title: Create Impl Plan
stage: plan
date: 2026-01-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: fullstack-todo-auth
branch: 001-fullstack-todo-auth
user: Claude Code
command: sp.plan
labels: [plan, implementation, architecture]
links:
  spec: specs/001-fullstack-todo-auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-fullstack-todo-auth/plan.md
 - specs/001-fullstack-todo-auth/research.md
 - specs/001-fullstack-todo-auth/data-model.md
 - specs/001-fullstack-todo-auth/quickstart.md
 - specs/001-fullstack-todo-auth/contracts/api-contract.md
 - CLAUDE.md
tests:
 - none
---

## Prompt

```text
# /sp.plan — Implementation Plan for Phase II: Full-Stack Todo Web Application

This plan outlines the **exact sequence of steps** required to fully implement the specification defined in `/sp.specify`.
All agents must follow this plan strictly. The FullstackIntegratorAgent will orchestrate execution, delegating to specialized subagents as indicated.

## Goal
Deliver a complete, secure, multi-user Todo web application with authentication and task CRUD operations, fully aligned with the project constitution and specification.

## Prerequisites (One-Time Setup)
1. **Environment Variables**
   - Generate a strong shared secret: `openssl rand -base64 32`
   - Set `BETTER_AUTH_SECRET` in both frontend and backend `.env` files (same value).
   - Set `DATABASE_URL` to Neon PostgreSQL connection string.

2. **Project Structure**
   - Ensure monorepo structure exists: `frontend/`, `backend/`, `specs/`, `.claude/agents/`.
   - All CLAUDE.md files (root, frontend, backend) are present.

## Implementation Phases

### Phase 1: Authentication Foundation (Led by AuthAgent)
1. **Frontend: Install and Configure Better Auth**
   - Install `better-auth` and `better-auth-jwt` plugin in `frontend/`.
   - Create Better Auth instance with JWT plugin enabled.
   - Set up sign-up and sign-in pages using Better Auth components/hooks.
   - Implement session persistence and protected route redirection.

2. **Frontend: Centralized API Client with JWT**
   - Create `frontend/src/lib/api.ts`.
   - Use Better Auth's `getSession()` or `useSession()` to retrieve JWT.
   - Implement wrapper functions (getTasks, createTask, etc.) that automatically add `Authorization: Bearer <jwt>` header.

3. **Backend: JWT Verification Middleware**
   - Install `pyjwt` and `python-multipart` in backend.
   - Create reusable dependency/middleware to:
     - Extract Bearer token from header
     - Verify and decode JWT using `BETTER_AUTH_SECRET`
     - Return authenticated `user_id` (from `sub` claim)
     - Return 401 if invalid/missing
   - Apply this dependency to all `/api/tasks` routes.

4. **Verification**
   - Test end-to-end: signup → login → API call succeeds with JWT → invalid token returns 401.

### Phase 2: Database Schema & Models (Led by DatabaseAgent)
1. **Define SQLModel Models**
   - In `backend/models.py`:
     - Import Better Auth's User model (do not redefine)
     - Define `Task` model with:
       - id, user_id (str, indexed), title, description, completed, created_at, updated_at
   - Add indexes on `user_id` and `completed`.

2. **Database Session Setup**
   - In `backend/db.py`: create engine and get_session dependency using `DATABASE_URL`.

3. **Coordinate with SpecValidator**
   - Update `/specs/database/schema.md` if needed.

### Phase 3: Backend API Routes (Led by BackendAgent)
Implement routes in `backend/routes/tasks.py` or similar, all protected by JWT dependency:

1. `GET /api/tasks` → list tasks filtered by authenticated user_id, support `status` and `sort` query params.
2. `POST /api/tasks` → create task with authenticated user_id.
3. `GET /api/tasks/{id}` → return task if belongs to user, else 404.
4. `PUT /api/tasks/{id}` → update if owned.
5. `DELETE /api/tasks/{id}` → delete if owned.
6. `PATCH /api/tasks/{id}/complete` → toggle completed if owned.

All routes:
- Filter queries by `user_id == current_user.id`
- Use proper HTTP status codes
- Return Pydantic-serialized responses

### Phase 4: Frontend UI & Integration (Led by FrontendAgent)
1. **Layout & Authentication Pages**
   - Create sign-up, sign-in, and layout with navigation (show logout when authenticated).

2. **Task List Page** (`/app/tasks/page.tsx`)
   - Fetch tasks on load (server component or client with useEffect)
   - Display list with title, status, created date
   - Add filters (status dropdown) and sort options
   - Buttons: New Task, Edit, Delete, Toggle Complete

3. **Create/Edit Task Forms**
   - Modal or separate page
   - Validation: title required (1–200), description ≤1000

4. **Protected Routes**
   - Redirect unauthenticated users to sign-in

5. **Error & Loading States**
   - Handle 401 (redirect to login), 404, network errors

### Phase 5: End-to-End Integration & Testing (Led by FullstackIntegratorAgent)
1. **Coordinate All Subagents**
   - Ensure consistent user_id flow from JWT → backend → database → frontend display.

2. **Manual Verification Checklist**
   - User A signs up → creates task → sees only their task
   - User B signs up → sees empty list (no access to User A's tasks)
   - Direct API call with wrong/no JWT → 401
   - Task operations on foreign ID → 404/403
   - Page refresh preserves session

3. **Final Spec Alignment**
   - Confirm all acceptance criteria in `/sp.specify` are met.
   - Update any `/specs/ui/` or `/specs/api/` files to reflect implemented components/endpoints.

## Completion Criteria
The project is complete when:
- All features in `/sp.specify` are fully implemented
- Multi-user isolation is enforced at every layer
- Application runs locally with `docker-compose` or separate dev servers
- No violations of the project constitution

**Execution Command for Agents**:
> "Execute the full implementation plan using FullstackIntegratorAgent. Begin with Phase 1 and proceed sequentially, delegating to specialized agents as defined."

This plan is authoritative. Deviations require explicit approval.
```

## Response snapshot

Created a comprehensive implementation plan for the full-stack todo web application with authentication. The plan includes:

1. Detailed implementation plan document (plan.md) outlining the approach
2. Research summary (research.md) documenting key decisions and alternatives
3. Data model specification (data-model.md) defining entities and relationships
4. Quickstart guide (quickstart.md) for developers to get started quickly
5. API contract (contracts/api-contract.md) specifying endpoints and data formats
6. Updated agent context in CLAUDE.md with relevant technologies

The plan follows the constitution requirements for using Next.js, FastAPI, SQLModel, Neon PostgreSQL, and Better Auth with JWT. It ensures user isolation and proper authentication flow.

## Outcome

- ✅ Impact: Created complete implementation plan with supporting documentation
- 🧪 Tests: none
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, api-contract.md, updated CLAUDE.md
- 🔁 Next prompts: Ready for task breakdown (/sp.tasks)
- 🧠 Reflection: The plan provides a clear roadmap for implementing the fullstack todo application with proper authentication and user isolation.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A