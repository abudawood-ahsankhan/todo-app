---
description: "Task list for Full-Stack Todo Web Application with Authentication implementation"
---

# Tasks: Full-Stack Todo Web Application with Authentication

**Input**: Design documents from `/specs/001-fullstack-todo-auth/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure: frontend/ and backend/ directories
- [X] T002 [P] Initialize backend with FastAPI, SQLModel, Better Auth dependencies in backend/requirements.txt
- [X] T003 [P] Initialize frontend with Next.js, Tailwind CSS, Better Auth dependencies in frontend/package.json
- [X] T004 [P] Configure linting and formatting tools for Python and TypeScript

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Setup database schema and migrations framework in backend/db.py
- [X] T006 [P] Implement authentication/authorization framework with Better Auth JWT in frontend and backend
- [X] T007 [P] Setup API routing and middleware structure in backend/main.py
- [X] T008 Create base models/entities that all stories depend on in backend/models/task_model.py
- [X] T009 Configure error handling and logging infrastructure
- [X] T010 Setup environment configuration management with .env files
- [X] T011 Create centralized API client with JWT attachment in frontend/src/lib/api.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to sign up, sign in, and maintain sessions with JWT authentication

**Independent Test**: Can be fully tested by signing up, signing in, verifying the session persists across page refreshes, and signing out. This delivers the core value of having a personal account.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T012 [P] [US1] Contract test for authentication endpoints in backend/tests/contract/test_auth.py
- [ ] T013 [P] [US1] Integration test for user authentication journey in backend/tests/integration/test_auth.py

### Implementation for User Story 1

- [X] T014 [P] [US1] Create signup page in frontend/src/app/signup/page.tsx
- [X] T015 [P] [US1] Create login page in frontend/src/app/login/page.tsx
- [X] T016 [US1] Implement Better Auth configuration in frontend/src/lib/auth.ts
- [X] T017 [US1] Implement protected route redirection logic in frontend/src/components/ProtectedRoute.tsx
- [X] T018 [US1] Add logout functionality in frontend/src/components/Navigation.tsx
- [X] T019 [US1] Add session persistence across page refreshes in frontend/src/lib/auth.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Task CRUD Operations (Priority: P2)

**Goal**: Allow authenticated users to create, read, update, delete, and toggle completion of tasks, with all operations restricted to their own tasks only.

**Independent Test**: Can be fully tested by creating tasks, viewing them, updating them, deleting them, and toggling their completion status. This delivers the complete task management experience.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T020 [P] [US2] Contract test for task endpoints in backend/tests/contract/test_tasks.py
- [ ] T021 [P] [US2] Integration test for task CRUD journey in backend/tests/integration/test_tasks.py

### Implementation for User Story 2

- [X] T022 [P] [US2] Implement JWT verification middleware in backend/src/api/deps.py
- [X] T023 [P] [US2] Create Task model with user_id foreign key in backend/src/models/task_model.py
- [X] T024 [US2] Implement Task service with user isolation in backend/src/services/task_service.py
- [X] T025 [US2] Implement GET /api/tasks endpoint in backend/src/api/routes/tasks.py
- [X] T026 [US2] Implement POST /api/tasks endpoint in backend/src/api/routes/tasks.py
- [X] T027 [US2] Implement GET /api/tasks/{id} endpoint in backend/src/api/routes/tasks.py
- [X] T028 [US2] Implement PUT /api/tasks/{id} endpoint in backend/src/api/routes/tasks.py
- [X] T029 [US2] Implement DELETE /api/tasks/{id} endpoint in backend/src/api/routes/tasks.py
- [X] T030 [US2] Implement PATCH /api/tasks/{id}/complete endpoint in backend/src/api/routes/tasks.py
- [X] T031 [US2] Create task list page in frontend/src/app/tasks/page.tsx
- [X] T032 [US2] Create task form component in frontend/src/components/TaskForm.tsx
- [X] T033 [US2] Create task item component in frontend/src/components/TaskItem.tsx
- [X] T034 [US2] Implement task API calls in frontend/src/lib/api.ts
- [X] T035 [US2] Add validation for title (1-200 chars) and description (≤1000 chars) in frontend/src/components/TaskForm.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Task Filtering and Sorting (Priority: P3)

**Goal**: Allow authenticated users to filter their tasks by status (all, pending, completed) and sort them by creation date or title.

**Independent Test**: Can be fully tested by applying different filter and sort combinations to the task list. This delivers improved usability and task management efficiency.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T036 [P] [US3] Contract test for filtering/sorting query parameters in backend/tests/contract/test_tasks_filter.py
- [ ] T037 [P] [US3] Integration test for filtering/sorting functionality in backend/tests/integration/test_tasks_filter.py

### Implementation for User Story 3

- [X] T038 [P] [US3] Update backend task service to support filtering by status in backend/src/services/task_service.py
- [X] T039 [P] [US3] Update backend task service to support sorting by creation date and title in backend/src/services/task_service.py
- [X] T040 [US3] Update GET /api/tasks endpoint to handle status and sort query params in backend/src/api/routes/tasks.py
- [X] T041 [US3] Add filtering UI controls to task list page in frontend/src/app/tasks/page.tsx
- [X] T042 [US3] Add sorting UI controls to task list page in frontend/src/app/tasks/page.tsx
- [X] T043 [US3] Update frontend task API calls to support query parameters in frontend/src/lib/api.ts

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T044 [P] Documentation updates in docs/
- [X] T045 Code cleanup and refactoring
- [X] T046 Performance optimization across all stories
- [X] T047 [P] Additional unit tests (if requested) in tests/unit/
- [X] T048 Security hardening
- [X] T049 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for authentication endpoints in backend/tests/contract/test_auth.py"
Task: "Integration test for user authentication journey in backend/tests/integration/test_auth.py"

# Launch all pages for User Story 1 together:
Task: "Create signup page in frontend/src/app/signup/page.tsx"
Task: "Create login page in frontend/src/app/login/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence