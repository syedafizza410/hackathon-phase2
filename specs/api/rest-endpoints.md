# API Endpoints Specification

## Overview
This specification defines the REST API endpoints for the Todo App Phase II. All endpoints require JWT authentication and implement user isolation to ensure users can only access their own data.

## Base URL
All API endpoints are prefixed with `/api/{user_id}` where `{user_id}` is extracted from the JWT token.

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

## Common Response Format
Success responses follow this format:
```json
{
  "success": true,
  "data": { ... }
}
```

Error responses follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## Endpoints

### GET /api/{user_id}/tasks
**Description:** Retrieve a list of tasks for the authenticated user
**Authentication:** Required
**Query Parameters:**
- `status`: Filter by status ('all', 'active', 'completed')
- `sort`: Sort order ('created_asc', 'created_desc', 'title_asc', 'title_desc')

**Response:**
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
  ]
}
```

### POST /api/{user_id}/tasks
**Description:** Create a new task for the authenticated user
**Authentication:** Required
**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description"
}
```

**Response:**
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

### GET /api/{user_id}/tasks/{id}
**Description:** Retrieve a specific task by ID for the authenticated user
**Authentication:** Required
**Parameters:**
- `id`: Task ID

**Response:**
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

### PUT /api/{user_id}/tasks/{id}
**Description:** Update a specific task by ID for the authenticated user
**Authentication:** Required
**Parameters:**
- `id`: Task ID
**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated task description"
}
```

**Response:**
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

### DELETE /api/{user_id}/tasks/{id}
**Description:** Delete a specific task by ID for the authenticated user
**Authentication:** Required
**Parameters:**
- `id`: Task ID

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Task deleted successfully"
  }
}
```

### PATCH /api/{user_id}/tasks/{id}/complete
**Description:** Toggle the completion status of a specific task for the authenticated user
**Authentication:** Required
**Parameters:**
- `id`: Task ID
**Request Body:**
```json
{
  "completed": true
}
```

**Response:**
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

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized: Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden: User ID mismatch or insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Not found: Resource does not exist"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Security Considerations
- All endpoints validate the user_id in the JWT token matches the user_id in the URL path
- No user should be able to access another user's data
- JWT tokens must be properly validated before processing requests
- Sensitive data should not be exposed in error messages