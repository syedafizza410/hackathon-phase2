# Database Schema Specification

## Overview
This specification defines the database schema for the Todo App Phase II. The database will use Neon Serverless PostgreSQL with tables for users and tasks, ensuring proper relationships and indexing for optimal performance.

## Database System
- Database: Neon Serverless PostgreSQL
- Connection: Via DATABASE_URL environment variable
- ORM: SQLModel (for backend implementation)

## Tables

### users table
This table is managed by Better Auth, but we define the expected structure for reference:

**Columns:**
- `id` (TEXT PRIMARY KEY): Unique identifier for the user
- `email` (TEXT UNIQUE NOT NULL): User's email address
- `name` (TEXT): User's display name
- `created_at` (TIMESTAMP): Account creation timestamp

**Indexes:**
- Primary key index on `id`
- Unique index on `email`

### tasks table
This table stores the todo tasks for each user:

**Columns:**
- `id` (INTEGER PRIMARY KEY): Auto-incrementing unique identifier for the task
- `user_id` (TEXT NOT NULL): Foreign key referencing the user who owns the task
- `title` (TEXT NOT NULL): Task title (1-255 characters)
- `description` (TEXT): Optional task description (up to 1000 characters)
- `completed` (BOOLEAN NOT NULL DEFAULT FALSE): Completion status
- `created_at` (TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP): Last update timestamp

**Indexes:**
- Primary key index on `id`
- Index on `user_id` for efficient user-based queries
- Index on `completed` for efficient status-based queries
- Composite index on (`user_id`, `completed`) for combined filtering

**Foreign Keys:**
- `user_id` references `users.id` with CASCADE delete (when a user is deleted, their tasks are also deleted)

## Relationships
- One user to many tasks (one-to-many relationship)
- Tasks are isolated by user_id to ensure data privacy

## Constraints
- All tasks must have a valid user_id
- Task titles must not be empty
- Completed status defaults to false

## Sample Queries

### Get all tasks for a user
```sql
SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC;
```

### Get completed tasks for a user
```sql
SELECT * FROM tasks WHERE user_id = $1 AND completed = TRUE ORDER BY created_at DESC;
```

### Create a new task
```sql
INSERT INTO tasks (user_id, title, description, completed) 
VALUES ($1, $2, $3, FALSE) 
RETURNING *;
```

### Update a task
```sql
UPDATE tasks 
SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP 
WHERE id = $3 AND user_id = $4 
RETURNING *;
```

### Delete a task
```sql
DELETE FROM tasks 
WHERE id = $1 AND user_id = $2;
```

## Security Considerations
- All queries must filter by user_id to prevent unauthorized access
- Use parameterized queries to prevent SQL injection
- Ensure proper access controls at the application level
- Regular backups should be performed

## Performance Considerations
- Proper indexing on user_id and completed columns for efficient querying
- Consider partitioning if the dataset grows very large
- Monitor query performance and adjust indexes as needed