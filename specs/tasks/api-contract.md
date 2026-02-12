# API Contract Specification for Frontend-Backend Integration

## Authentication Flow
- Frontend uses Better Auth to generate JWT tokens
- Backend verifies JWT using BETTER_AUTH_SECRET
- All API requests must include Authorization: Bearer <JWT_TOKEN> header
- Backend extracts user_id from JWT token (sub claim) and compares with {user_id} in URL path

## Endpoint Specifications

### GET /api/{user_id}/tasks
- Request: Authorization header with JWT
- Query params: status (all/active/completed), sort (created_desc/created_asc/title_asc/title_desc), page, pageSize
- Response: 200 with { success: true, data: Task[], meta: PaginationMeta }
- Errors: 401 (invalid token), 403 (user_id mismatch)

### POST /api/{user_id}/tasks
- Request: Authorization header with JWT, JSON body { title: string, description?: string }
- Response: 201 with { success: true, data: Task }
- Errors: 401 (invalid token), 403 (user_id mismatch), 422 (validation error)

### GET /api/{user_id}/tasks/{id}
- Request: Authorization header with JWT
- Response: 200 with { success: true, data: Task }
- Errors: 401 (invalid token), 403 (user_id mismatch), 404 (task not found)

### PUT /api/{user_id}/tasks/{id}
- Request: Authorization header with JWT, JSON body { title?: string, description?: string }
- Response: 200 with { success: true, data: Task }
- Errors: 401 (invalid token), 403 (user_id mismatch), 404 (task not found)

### DELETE /api/{user_id}/tasks/{id}
- Request: Authorization header with JWT
- Response: 200 with { success: true, data: { message: string } }
- Errors: 401 (invalid token), 403 (user_id mismatch), 404 (task not found)

### PATCH /api/{user_id}/tasks/{id}/complete
- Request: Authorization header with JWT, JSON body { completed: boolean }
- Response: 200 with { success: true, data: Task }
- Errors: 401 (invalid token), 403 (user_id mismatch), 404 (task not found)

## Data Models

### Task Model
{
  id: number,
  title: string,
  description?: string,
  completed: boolean,
  createdAt: string, // ISO date string
  updatedAt: string  // ISO date string
}

### Pagination Meta
{
  total: number,
  page: number,
  pageSize: number,
  totalPages: number
}

## Error Response Format
{
  success: false,
  error: string,
  details?: any
}

## Security Requirements
- All endpoints must verify JWT token validity
- All endpoints must verify that user_id in JWT matches user_id in URL path
- No user should be able to access another user's tasks
- Proper error responses for unauthorized access (401/403)
- Input validation for all request bodies
- Rate limiting considerations for production

## CORS Configuration
- Allow origin: http://localhost:3000 (or configured FRONTEND_URL)
- Allow credentials: true (for JWT cookies if used)
- Allow headers: Authorization, Content-Type
- Allow methods: GET, POST, PUT, DELETE, PATCH

## Environment Variables
- BETTER_AUTH_SECRET: Shared secret for JWT verification (same as frontend)
- DATABASE_URL: Neon PostgreSQL connection string
- FRONTEND_URL: Origin for CORS configuration
- ENVIRONMENT: Development/production flag