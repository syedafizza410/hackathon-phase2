# Todo App - Hackathon II

This is a full-stack todo application built as part of **Hackathon II Phase II**.  
The app is a multi-user web application with persistent storage, built using Next.js (frontend), FastAPI (backend), and Neon Serverless PostgreSQL (database).  

The project follows a **spec-driven development workflow** using GitHub Spec-Kit and Claude Code.

---

## Features

- User authentication (signup/signin) using **Better Auth**
- Task management:
  - Create new tasks
  - View all tasks
  - Update tasks
  - Delete tasks
  - Toggle completion
- Task filtering (active, completed, all)
- Task sorting (by creation date ascending/descending)
- Pagination support
- JWT-based authentication to secure API requests
- Responsive UI for all device sizes
- Spec-driven development for maintainable and testable code

---

## Tech Stack

### Frontend
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Better Auth for authentication
- API client for backend communication

### Backend
- Python FastAPI
- SQLModel ORM
- PostgreSQL (Neon Serverless)
- JWT-based API authentication

### Spec-Driven Tools
- Claude Code
- Spec-Kit Plus

---

## REST API Endpoints

All endpoints require a **valid JWT token** in the `Authorization: Bearer <token>` header.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/{user_id}/tasks` | GET | List all tasks for the authenticated user (supports filters, sort, pagination) |
| `/api/{user_id}/tasks` | POST | Create a new task |
| `/api/{user_id}/tasks/{task_id}` | GET | Get details of a specific task |
| `/api/{user_id}/tasks/{task_id}` | PUT | Update a task (title, description, completed) |
| `/api/{user_id}/tasks/{task_id}` | DELETE | Delete a task |
| `/api/{user_id}/tasks/{task_id}/complete` | PATCH | Toggle task completion status |

### Query Parameters (GET /tasks)

- `status`: `"all"` | `"active"` | `"completed"`  
- `sort`: `"created_asc"` | `"created_desc"`  
- `page`: integer (default: 1)  
- `pageSize`: integer (default: 10)

### Request Body (POST/PUT)

```json
{
  "title": "Task title",
  "description": "Optional task description",
  "completed": false
}
