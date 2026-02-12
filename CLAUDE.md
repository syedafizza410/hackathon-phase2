# Todo App - Hackathon II | Phase II Constitution

## Purpose of This Constitution
This is the root-level constitution file for the hackathon-todo monorepo.  
It defines the strict rules, structure, agents, skills, and guidelines that EVERY agent (including root-orchestrator) MUST follow.  

**Current Status**: We are ONLY creating and refining this constitution.md file.  
**No implementation, no code generation, no file writes, no Qwen/Claude task execution yet.**  
This file exists solely to guide future steps safely and spec-driven.

## Core Principle – Spec-Driven Development with Spec-Kit Plus
- Project is 100% spec-driven using **Spec-Kit Plus** (assumed initialized via spec-kit init).
- ALL work MUST start from /specs/ files (features/, api/, database/, ui/).
- Forbidden: Any code, file change, or implementation without first referencing or updating a spec file using @specs/... notation.
- If spec is incomplete/missing detail → update spec FIRST via spec-writer agent (but only when we decide to start implementation).
- Single source of truth = specs folder + this constitution.

## Project Phase & Requirements Summary (Phase II Only)
Objective: Convert console Todo app to multi-user full-stack web app with persistent storage.  
Must implement:
- All 5 Basic Level features: List tasks, Create, Get details, Update, Delete, Toggle completion.
- RESTful API endpoints
- Responsive frontend
- Neon Serverless PostgreSQL storage
- Authentication: Signup/signin via Better Auth

## Technology Stack (Phase II)
- Frontend: Next.js 16+ (App Router), TypeScript, Tailwind CSS
- Backend: Python FastAPI, SQLModel ORM
- Database: Neon Serverless PostgreSQL (env: DATABASE_URL)
- Auth: Better Auth (frontend) + JWT tokens; FastAPI verifies with BETTER_AUTH_SECRET (shared env)
- Development: Spec-Kit Plus + Claude Code / Qwen CLI agents & skills

## API Endpoints (All Protected by JWT)
Method | Endpoint                           | Description
-------|------------------------------------|--------------------------------------
GET    | /api/{user_id}/tasks              | List tasks (query: status, sort)
POST   | /api/{user_id}/tasks              | Create task
GET    | /api/{user_id}/tasks/{id}         | Get single task
PUT    | /api/{user_id}/tasks/{id}         | Update task
DELETE | /api/{user_id}/tasks/{id}         | Delete task
PATCH  | /api/{user_id}/tasks/{id}/complete| Toggle completed status

- All endpoints require Authorization: Bearer <JWT>
- Backend must verify token, extract user_id, match with {user_id} in path, filter data
- 401 if no/invalid token, 403 if user mismatch

## Authentication Flow
1. User signup/signin on frontend → Better Auth issues JWT
2. Frontend stores JWT → attaches to every API request header
3. Backend middleware: Verify signature (BETTER_AUTH_SECRET), decode, attach user to request
4. Every operation filters by authenticated user_id

## Database Schema (From specs/database/schema.md)
- users: Better Auth managed (id: str PK, email unique, name, created_at)
- tasks: id (int PK), user_id (str FK), title (str not null), description (text nullable), completed (bool false), created_at, updated_at
- Indexes: user_id, completed

## Monorepo Structure & Key Files
- .spec-kit/config.yaml → phases configured
- specs/ → overview.md, features/task-crud.md, authentication.md, api/rest-endpoints.md, database/schema.md, ui/...
- CLAUDE.md (root) → general instructions
- frontend/CLAUDE.md → Next.js patterns
- backend/CLAUDE.md → FastAPI patterns
- docker-compose.yml → run both services

## Available Agents (Defined in .claude/agents/)
- root-orchestrator (this constitution's main agent)
- spec-writer
- backend-dev
- frontend-dev
- db-manager

## Available Skills (Defined in .claude/skills/)
- jwt-verification
- task-crud-impl
- auth-integration
- user-isolation-enforce
- api-client-setup

## Strict Safety & Step-by-Step Rules
1. Do NOT generate any code, write any file, or spawn agents/skills until explicitly instructed.
2. Current task: ONLY refine and finalize this constitution.md file.
3. When implementation starts (later), follow this order:
   - Reference spec first ( @specs/...)
   - If needed, update spec
   - Plan step-by-step
   - Use agents/skills only when spec allows
   - Verify security (JWT, isolation) in every step
   - Test with docker-compose commands
4. Never assume implementation has started unless user says "ab implementation start karo".

This constitution.md is now finalized for Phase II preparation.  
No further changes unless user asks.  
Ready for next instruction.