# Detailed Backend Implementation Tasks

## File 1.1: backend/requirements.txt
- Task: Add all required Python packages with specific versions
- Details: Include fastapi, sqlmodel, pydantic, pyjwt, uvicorn, python-dotenv, psycopg2-binary, better-auth, and testing dependencies

## File 1.2: backend/Dockerfile
- Task: Create Dockerfile for backend service
- Details: Use Python base image, copy requirements, install dependencies, copy source code, expose port 8000, run uvicorn

## File 1.3: backend/.env
- Task: Create environment variables template
- Details: Define BETTER_AUTH_SECRET, DATABASE_URL, FRONTEND_URL, ENVIRONMENT

## File 1.4: backend/main.py
- Task: Create FastAPI application instance
- Details: Import necessary modules, create FastAPI app, add CORS middleware, include API routers, add health check endpoint

## File 1.5: backend/config.py
- Task: Create configuration module
- Details: Define settings class with validation, load environment variables, configure CORS origins

## File 2.1: backend/db.py
- Task: Set up database connection
- Details: Create engine with DATABASE_URL, create session factory, define get_session dependency

## File 2.2: backend/models.py
- Task: Define SQLModel models
- Details: Create Task model with id, user_id, title, description, completed, timestamps; add proper relationships and constraints

## File 2.3: backend/schemas.py
- Task: Define Pydantic schemas for API validation
- Details: Create TaskBase, TaskCreate, TaskUpdate, TaskResponse schemas; define API response formats matching frontend expectations

## File 2.4: backend/database_utils.py
- Task: Create database utility functions
- Details: Helper functions for common database operations, session management utilities

## File 3.1: backend/auth.py
- Task: Implement JWT authentication utilities
- Details: Functions to create, verify, and decode JWT tokens; extract user_id from token claims

## File 3.2: backend/middleware.py
- Task: Create authentication middleware
- Details: JWT verification middleware that checks token validity and extracts user info

## File 3.3: backend/dependencies.py
- Task: Create authentication dependencies
- Details: Dependency functions that verify authentication and return current user

## File 4.1: backend/routes/__init__.py
- Task: Initialize routes package
- Details: Import and expose the tasks router

## File 4.2: backend/routes/tasks.py
- Task: Implement all task-related API endpoints
- Details: GET, POST, PUT, DELETE, PATCH endpoints with proper authentication checks and user isolation

## File 4.3: backend/services/tasks.py
- Task: Create task business logic layer
- Details: Functions for task operations with proper validation and error handling

## File 5.1: backend/utils.py
- Task: Create utility functions
- Details: General helper functions for the application

## File 5.2: backend/errors.py
- Task: Define custom exceptions
- Details: Application-specific error classes with proper HTTP status codes

## File 5.3: backend/constants.py
- Task: Define application constants
- Details: Constant values used throughout the application

## File 6.1: backend/tests/conftest.py
- Task: Set up test configuration
- Details: Pytest fixtures for database, app, and authentication testing

## File 6.2: backend/tests/test_auth.py
- Task: Create authentication tests
- Details: Test JWT token creation, verification, and middleware functionality

## File 6.3: backend/tests/test_tasks.py
- Task: Create task operation tests
- Details: Test all CRUD operations with proper authentication and user isolation

## File 6.4: backend/tests/test_security.py
- Task: Create security tests
- Details: Test user isolation, unauthorized access attempts, and permission enforcement

## File 7.1: backend/README.md
- Task: Create backend documentation
- Details: Setup instructions, API documentation, environment variables, deployment notes

## File 7.2: docker-compose.yml
- Task: Update docker-compose with backend service
- Details: Add backend service configuration with proper networking and environment

## File 7.3: backend/pyproject.toml
- Task: Create Python project configuration
- Details: Define project metadata, build system, and development dependencies