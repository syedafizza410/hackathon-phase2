# Backend Implementation Plan for Todo App Phase II

## 1. Prerequisites & Spec References
- @specs/api/backend-spec.md (main backend specification)
- @specs/features/task-crud.md (task operations requirements)
- @specs/features/authentication.md (authentication requirements)
- @specs/api/rest-endpoints.md (API endpoint definitions)
- @specs/database/schema.md (database schema requirements)
- constitution.md (project governance and safety rules)

Any initial spec updates needed:
- If authentication details are incomplete/missing detail in @specs/features/authentication.md, use spec-writer agent to update with JWT token handling specifics
- If API endpoint details are insufficient in @specs/api/rest-endpoints.md, use spec-writer agent to enhance with request/response type definitions

## 2. High-Level Steps (Sequential Order)
1. Backend Project Setup & Dependencies
2. Database Connection & Models
3. JWT Authentication Middleware
4. API Routes & CRUD Operations
5. User Isolation & Security Enforcement
6. CORS & Error Handling
7. Integration Testing Plan (with frontend)
8. Final Verification & Docker Setup

## 3. Detailed Step-by-Step Breakdown

### Step 1: Backend Project Setup & Dependencies
- What to do: Initialize FastAPI project with proper directory structure and install required dependencies
- Agent/Skill: Use backend-dev agent to set up project structure
- Spec reference: @specs/api/backend-spec.md (Project Structure section)
- Expected output: backend/ directory with main.py, requirements.txt, and proper folder structure
- Integration considerations: Ensure dependencies match frontend expectations (same JWT algorithm, etc.)
- Security/UX considerations: Secure dependency versions, proper project structure for maintainability

### Step 2: Database Connection & Models
- What to do: Set up Neon PostgreSQL connection using SQLModel and create Task model
- Agent/Skill: Use db-manager agent for database schema setup
- Spec reference: @specs/database/schema.md (Database Schema section) and @specs/api/backend-spec.md (Database & Models section)
- Expected output: db.py with engine/session, models.py with Task SQLModel class
- Integration considerations: Model fields must match frontend Task type exactly
- Security/UX considerations: Proper indexing for performance, foreign key constraints for data integrity

### Step 3: JWT Authentication Middleware
- What to do: Create JWT verification middleware that extracts user_id from token and enforces user isolation
- Agent/Skill: Use backend-dev agent with jwt-verification skill
- Spec reference: @specs/api/backend-spec.md (Authentication & JWT Middleware section)
- Expected output: auth.py with JWT verification utilities and middleware
- Integration considerations: Must use same JWT algorithm and secret as frontend (BETTER_AUTH_SECRET)
- Security/UX considerations: Proper token validation, secure user_id extraction, 401/403 error handling

### Step 4: API Routes & CRUD Operations
- What to do: Implement all required REST endpoints with proper request/response handling
- Agent/Skill: Use backend-dev agent with task-crud-impl skill
- Spec reference: @specs/api/backend-spec.md (API Endpoints Specification section) and @specs/api/rest-endpoints.md
- Expected output: routes/tasks.py with all CRUD operations (GET, POST, PUT, DELETE, PATCH)
- Integration considerations: Response format must match frontend API client expectations exactly
- Security/UX considerations: Proper validation, consistent error responses, user isolation enforcement

### Step 5: User Isolation & Security Enforcement
- What to do: Ensure all endpoints verify user_id in path matches authenticated user_id
- Agent/Skill: Use backend-dev agent with user-isolation-enforce skill
- Spec reference: @specs/api/backend-spec.md (Security considerations section)
- Expected output: All route handlers include user_id verification logic
- Integration considerations: Frontend sends user_id in path, backend must verify against JWT
- Security/UX considerations: Critical security feature - no user should access another's data

### Step 6: CORS & Error Handling
- What to do: Configure CORS to allow frontend origin and implement proper error responses
- Agent/Skill: Use backend-dev agent for configuration
- Spec reference: @specs/api/backend-spec.md (Integration Requirements section)
- Expected output: CORS middleware configuration, HTTPException handlers
- Integration considerations: Must allow http://localhost:3000 with credentials for dev
- Security/UX considerations: Proper error masking to avoid information leakage

### Step 7: Integration Testing Plan (with frontend)
- What to do: Define tests to verify backend works correctly with frontend API client
- Agent/Skill: Use backend-dev agent for testing
- Spec reference: @specs/api/backend-spec.md (Acceptance Criteria section)
- Expected output: Test suite verifying all endpoints work with frontend
- Integration considerations: Test successful calls, 401 on no token, 403 on wrong user_id
- Security/UX considerations: Verify no data leakage between users

### Step 8: Final Verification & Docker Setup
- What to do: Verify all endpoints work with frontend, create Docker configuration
- Agent/Skill: Use backend-dev agent for final verification
- Spec reference: @specs/api/backend-spec.md (Acceptance Criteria section)
- Expected output: docker-compose.yml that runs backend with frontend
- Integration considerations: Ensure API endpoints match exactly what frontend expects
- Security/UX considerations: Production-ready configuration with security best practices

## 4. Dependencies & Environment Vars

Required packages:
- fastapi (ASGI framework)
- sqlmodel (ORM with SQL Alchemy + Pydantic)
- pydantic (data validation)
- pyjwt (JWT handling)
- uvicorn (ASGI server)
- python-dotenv (environment variables)
- psycopg2-binary (PostgreSQL adapter)
- better-auth (authentication library)

Environment variables needed by backend:
- BETTER_AUTH_SECRET (shared with frontend for JWT verification)
- DATABASE_URL (Neon PostgreSQL connection string)
- FRONTEND_URL (for CORS configuration, default: http://localhost:3000)

## 5. Acceptance Criteria for Backend Completion
- [ ] All endpoints return correct data only for authenticated user
- [ ] 401 Unauthorized returned for missing/invalid JWT tokens
- [ ] 403 Forbidden returned when user_id in path doesn't match authenticated user
- [ ] Response format matches frontend API client expectations exactly
- [ ] All CRUD operations work correctly (create, read, update, delete, toggle completion)
- [ ] User isolation is enforced - no user can access another's data
- [ ] CORS configured to allow frontend origin with credentials
- [ ] Error responses follow frontend API client format
- [ ] Integration tests pass with frontend API client
- [ ] No data leak possible between users
- [ ] Performance acceptable with reasonable number of tasks
- [ ] Security audit passed (JWT verification, user isolation, etc.)

## 6. Safety & Pause Rules
- Backend plan is ready for review; wait for user to say "start backend implementation from step 1"
- No code execution or file creation happens yet until explicitly instructed
- All steps must be verified against acceptance criteria in specs before marking complete
- Backend implementation must follow spec-driven development principles
- All work must reference @specs/... files when implementing features
- Integration with frontend must be tested at each step
- Security features (user isolation, JWT verification) must be implemented correctly