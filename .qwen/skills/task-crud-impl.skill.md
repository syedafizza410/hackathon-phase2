---
name: task-crud-impl
description: Implements full Task CRUD operations in FastAPI + SQLModel, with user_id filtering and ownership enforcement.
---

# Task CRUD Implementation Skill

Implement the 5 basic task operations per @specs/features/task-crud.md and @specs/api/rest-endpoints.md.

## Endpoints to Implement
- GET /api/{user_id}/tasks → list (with ?status & ?sort query params)
- POST /api/{user_id}/tasks → create {title, description?}
- GET /api/{user_id}/tasks/{id} → get one
- PUT /api/{user_id}/tasks/{id} → update
- DELETE /api/{user_id}/tasks/{id} → delete
- PATCH /api/{user_id}/tasks/{id}/complete → toggle completed

## Rules
- Use SQLModel Task model.
- Every operation: filter by user_id from JWT (request.state.user.id)
- Create: task.user_id = authenticated_user_id
- Return only user's tasks.
- Use Pydantic models for request/response.

## Acceptance Criteria
- Title required 1-200 chars.
- Description optional ≤1000 chars.
- Completed default False.