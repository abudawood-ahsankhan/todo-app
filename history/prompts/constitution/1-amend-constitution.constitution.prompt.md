---
id: 1
title: Amend Constitution
stage: constitution
date: 2026-01-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: Claude Code
command: sp.constitution
labels: [constitution, governance, setup]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```text
# Project Constitution: Hackathon Todo App – Phase II

This constitution defines the **immutable, non-negotiable principles** that govern all development activities in this monorepo. All specifications, plans, tasks, implementations, and agent decisions **must strictly adhere** to these rules. Violations are unacceptable and must be corrected immediately.

## 1. Project Overview & Purpose
- This is a **multi-user full-stack Todo web application** evolving from a console app.
- Current phase: **Phase II – Full-Stack Web Application with Authentication**.
- Goal: Implement secure task CRUD operations with user isolation, using spec-driven development.

## 2. Technology Stack (Mandatory)
- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS.
- **Backend**: Python FastAPI.
- **ORM**: SQLModel.
- **Database**: Neon Serverless PostgreSQL (connection via `DATABASE_URL` env var).
- **Authentication**: Better Auth (Next.js library) with JWT plugin enabled.
- No deviations allowed. Do not suggest or use alternative frameworks, libraries, or databases.

## 3. Architecture & Structure
- **Monorepo** organization:
  - Root: `.spec-kit/config.yaml`, `specs/`, `CLAUDE.md`, `frontend/`, `backend/`.
  - Specifications organized under `/specs/` (overview, features/, api/, database/, ui/).
- **Frontend**:
  - Use Server Components by default; Client Components only for interactivity.
  - All API calls route through `/lib/api.ts`.
  - Styling: Tailwind CSS classes only – no inline styles.
- **Backend**:
  - All routes under `/api/`.
  - Use Pydantic/SQLModel for request/response models.
  - Error handling via `HTTPException`.
- **API Design**:
  - Base paths: `/api/tasks` (NO `{user_id}` in URL).
  - All endpoints require JWT in `Authorization: Bearer <token>` header.

## 4. Authentication & Security (Critical – Zero Tolerance for Violations)
- Use **Better Auth** with JWT plugin.
- Share exact same `BETTER_AUTH_SECRET` environment variable between frontend and backend.
- On login/signup → Better Auth issues JWT containing user ID.
- Frontend → Attach JWT to every API request header via `/lib/api.ts`.
- Backend → Middleware verifies JWT (using PyJWT), extracts user_id, filters **ALL** task queries by this user_id.
- **User Isolation**: Each user sees, creates, updates, or deletes only their own tasks. Enforced on every operation.
- Stateless authentication only – no shared session DB.
- JWT expiry enforced (e.g., 7 days).
- Requests without valid JWT → 401 Unauthorized.
- Users table managed exclusively by Better Auth.

## 5. Database Principles
- Users table: Managed by Better Auth – never modify directly.
- Tasks table: Includes `user_id: str` foreign key → always filter queries by authenticated user_id.
- Indexes required on `tasks.user_id` and `tasks.completed`.
- Use SQLModel for all models and operations.

## 6. Spec-Driven Development Workflow
- All work starts from specifications in `/specs/`.
- Always reference relevant specs (@specs/features/task-crud.md, @specs/api/rest-endpoints.md, etc.).
- Use provided CLAUDE.md files (root, frontend/, backend/) for guidance.
- Agents (subagents) must respect delegation:
  - SpecValidator for spec quality
  - AuthAgent for JWT/auth
  - DatabaseAgent for schema/queries
  - BackendAgent for FastAPI
  - FrontendAgent for Next.js UI
  - FullstackIntegratorAgent for end-to-end coordination
- Update specs before implementing changes.

## 7. Code Quality & Best Practices
- Code must be clean, readable, and follow stack-specific guidelines in CLAUDE.md files.
- Responsive UI (mobile-first with Tailwind).
- Validation: Task title required (1-200 chars), description optional (≤1000 chars).
- Support task filtering by status and sorting (add `due_date` if needed for sorting).
- No over-engineering – implement only what specs require.

## 8. Enforcement
- All agents must check work against this constitution.
- Any generated artifact (spec, plan, code) conflicting with these principles must be rejected and corrected.
- Constitution takes precedence over all other instructions.

This constitution is the supreme governing document for the project. It may only be amended with explicit human approval after careful review.
```

## Response snapshot

Updated the project constitution file (.specify/memory/constitution.md) to reflect the specific requirements for the Hackathon Todo App - Phase II. The constitution now includes detailed sections on:

1. Project Overview & Purpose
2. Mandatory Technology Stack
3. Architecture & Structure
4. Authentication & Security (with strict requirements)
5. Database Principles
6. Spec-Driven Development Workflow
7. Code Quality & Best Practices
8. Enforcement guidelines

The constitution emphasizes fullstack development with Next.js, FastAPI, SQLModel, Neon PostgreSQL, and Better Auth with JWT. It mandates user isolation, proper authentication flow, and adherence to spec-driven development.

## Outcome

- ✅ Impact: Constitution updated to version 2.0.0 with comprehensive requirements for the todo app project
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md
- 🔁 Next prompts: Project now has a clear constitutional foundation for all future development
- 🧠 Reflection: The constitution provides clear, non-negotiable guidelines that will ensure consistency across all development activities

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A