# Todo App Backend API

This is the backend API for the Todo App Phase II, built with FastAPI and SQLModel. It integrates with Better Auth for authentication and is designed to be deployed on Vercel.

## Features

- JWT-based authentication with Better Auth
- User-isolated task management
- RESTful API endpoints
- Database integration with PostgreSQL
- CORS configured for Vercel deployment

## Tech Stack

- FastAPI
- SQLModel
- Pydantic v2
- PostgreSQL
- Better Auth
- Vercel for deployment

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_app
BETTER_AUTH_SECRET=your_better_auth_secret_here
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development
DB_POOL_SIZE=1
DB_MAX_OVERFLOW=0
```

## Installation

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables in `.env` file

3. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

## Deployment

This application is designed for deployment on Vercel. The configuration is already set up in `vercel.json`.

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET/POST/PUT/DELETE /api/{user_id}/tasks` - Task management endpoints
- `POST /api/auth/login` - Login endpoint
- `POST /api/auth/register` - Registration endpoint

## Authentication

All task-related endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The JWT token is issued by Better Auth and contains the user ID which is used to enforce user isolation.

## Database Models

### Task Model
- `id`: Integer (Primary Key)
- `title`: String (Required, max length 255)
- `description`: String (Optional, max length 1000)
- `completed`: Boolean (Default: False)
- `user_id`: String (Foreign Key reference to user)
- `created_at`: DateTime (Default: current timestamp)
- `updated_at`: DateTime (Default: current timestamp)

## Error Handling

The API returns appropriate HTTP status codes and JSON error messages:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Local Development

For local development, make sure to:

1. Set the `ENVIRONMENT` variable to `development`
2. Use appropriate database connection settings
3. Set `FRONTEND_URL` to your local frontend URL (typically `http://localhost:3000`)

## Production Deployment

When deploying to production:

1. Set `ENVIRONMENT` to `production`
2. Use secure values for `BETTER_AUTH_SECRET`
3. Configure proper database connection settings
4. Set `FRONTEND_URL` to your production frontend URL