# Backend Specification for Todo App Phase II

## Overview
This spec defines the backend implementation using FastAPI + SQLModel + Neon PostgreSQL.  
It ensures 100% compatibility and zero-error integration with the existing frontend (Next.js + Better Auth + /lib/api.ts).  
All endpoints protected by JWT; strict user isolation enforced.

## Integration Requirements with Frontend
- Frontend attaches Authorization: Bearer <JWT> to every request
- Backend MUST verify token and return only user's own data
- Response format: JSON objects/arrays matching frontend Task type
- Error responses: { "detail": "message" } with status codes (401, 403, 404, 422)
- Base URL: http://localhost:8000 in dev (match NEXT_PUBLIC_API_URL in frontend env)
- CORS: Allow frontend origin (http://localhost:3000) with credentials

## API Endpoints Specification
- List all endpoints exactly as in @specs/api/rest-endpoints.md but with {user_id} in path
- For each endpoint:

### GET /api/{user_id}/tasks
**Method:** GET
**Path:** /api/{user_id}/tasks
**Authentication requirement:** Required - Valid JWT token in Authorization header
**Request:**
- Headers: Authorization: Bearer <JWT_TOKEN>
- Query Parameters:
  - `status`: Filter by status ('all', 'active', 'completed')
  - `sort`: Sort order ('created_asc', 'created_desc', 'title_asc', 'title_desc')
  - `page`: Page number for pagination (optional)
  - `pageSize`: Number of items per page (optional)

**Response:**
- Status codes: 200 (OK), 401 (Unauthorized), 403 (Forbidden)
- Body schema:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Sample task",
      "description": "Sample description",
      "completed": false,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```
- Security checks: JWT verify, user_id match with path parameter

### POST /api/{user_id}/tasks
**Method:** POST
**Path:** /api/{user_id}/tasks
**Authentication requirement:** Required - Valid JWT token in Authorization header
**Request:**
- Headers: Authorization: Bearer <JWT_TOKEN>
- Body schema:
```json
{
  "title": "Task title",
  "description": "Task description"
}
```

**Response:**
- Status codes: 201 (Created), 401 (Unauthorized), 403 (Forbidden), 422 (Validation Error)
- Body schema:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```
- Security checks: JWT verify, user_id match with path parameter

### GET /api/{user_id}/tasks/{id}
**Method:** GET
**Path:** /api/{user_id}/tasks/{id}
**Authentication requirement:** Required - Valid JWT token in Authorization header
**Request:**
- Headers: Authorization: Bearer <JWT_TOKEN>
- Parameters:
  - `id`: Task ID (path parameter)

**Response:**
- Status codes: 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
- Body schema:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```
- Security checks: JWT verify, user_id match with path parameter, task belongs to user

### PUT /api/{user_id}/tasks/{id}
**Method:** PUT
**Path:** /api/{user_id}/tasks/{id}
**Authentication requirement:** Required - Valid JWT token in Authorization header
**Request:**
- Headers: Authorization: Bearer <JWT_TOKEN>
- Parameters:
  - `id`: Task ID (path parameter)
- Body schema:
```json
{
  "title": "Updated task title",
  "description": "Updated task description"
}
```

**Response:**
- Status codes: 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 422 (Validation Error)
- Body schema:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated task title",
    "description": "Updated task description",
    "completed": false,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-02T00:00:00Z"
  }
}
```
- Security checks: JWT verify, user_id match with path parameter, task belongs to user

### DELETE /api/{user_id}/tasks/{id}
**Method:** DELETE
**Path:** /api/{user_id}/tasks/{id}
**Authentication requirement:** Required - Valid JWT token in Authorization header
**Request:**
- Headers: Authorization: Bearer <JWT_TOKEN>
- Parameters:
  - `id`: Task ID (path parameter)

**Response:**
- Status codes: 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
- Body schema:
```json
{
  "success": true,
  "data": {
    "message": "Task deleted successfully"
  }
}
```
- Security checks: JWT verify, user_id match with path parameter, task belongs to user

### PATCH /api/{user_id}/tasks/{id}/complete
**Method:** PATCH
**Path:** /api/{user_id}/tasks/{id}/complete
**Authentication requirement:** Required - Valid JWT token in Authorization header
**Request:**
- Headers: Authorization: Bearer <JWT_TOKEN>
- Parameters:
  - `id`: Task ID (path parameter)
- Body schema:
```json
{
  "completed": true
}
```

**Response:**
- Status codes: 200 (OK), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
- Body schema:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Task title",
    "description": "Task description",
    "completed": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-02T00:00:00Z"
  }
}
```
- Security checks: JWT verify, user_id match with path parameter, task belongs to user

## Authentication & JWT Middleware
- Middleware to verify JWT using PyJWT + BETTER_AUTH_SECRET env
- Extract user_id from token payload (sub claim)
- Attach to request.state.user_id
- Enforce user_id in path == authenticated user_id → 403 if not
- 401 for invalid/missing/expired token
- Middleware must run before route handlers to ensure authentication

## Database & Models
- Use SQLModel for ORM
- Tasks model: user_id FK to users.id, title not null, etc.
- Always filter queries by request.state.user_id
- Indexes for performance on user_id and completed fields
- Proper foreign key constraints between users and tasks

## Project Structure (backend/)
- main.py: App, middleware, CORS
- db.py: Engine/session (DATABASE_URL env)
- models.py: SQLModel classes (Task)
- routes/: Task router (APIRouter(prefix="/api"))
- dependencies.py: Optional dependency for current_user
- auth.py: JWT verification utilities

## Error Handling & Validation
- Use HTTPException for 401/403/404/422
- Pydantic models for request/response validation
- Proper error messages that match frontend expectations
- Consistent error response format

## Environment Variables
- BETTER_AUTH_SECRET (shared with frontend)
- DATABASE_URL (Neon PostgreSQL)
- ALLOWED_ORIGINS (for CORS - typically http://localhost:3000 in dev)

## Acceptance Criteria
- All endpoints return correct data only for authenticated user
- Integration test cases (from frontend perspective): successful calls, 401 on no token, 403 on wrong user_id
- No data leak possible
- Response format matches frontend API client expectations
- Proper JWT validation and user isolation

## Dependencies
- fastapi, sqlmodel, pydantic, pyjwt, uvicorn, python-dotenv, psycopg2-binary

Reference this spec for all backend work.  
Update if frontend changes require backend adjustment.