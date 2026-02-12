# Task CRUD Features Specification

## Overview
This specification defines the core task management features for the Todo App Phase II. These features will be implemented in the frontend and connected to backend API endpoints.

## Features
- List tasks with filtering and sorting capabilities
- Create new tasks with title and description
- Get details of a specific task
- Update existing tasks
- Delete tasks
- Toggle task completion status

## User Stories
- As a user, I can view all my tasks in a list
- As a user, I can filter tasks by status (all, active, completed)
- As a user, I can sort tasks by creation date or title
- As a user, I can create a new task with a title and optional description
- As a user, I can view details of a specific task
- As a user, I can edit an existing task
- As a user, I can delete a task I no longer need
- As a user, I can mark a task as completed or active

## Data Model
- Task: { id: number, title: string, description: string, completed: boolean, createdAt: Date, updatedAt: Date }

## Validation Rules
- Title is required and must be between 1-255 characters
- Description is optional and can be up to 1000 characters
- Completed status defaults to false

## Error Handling
- Handle network errors gracefully
- Show appropriate error messages to the user
- Implement retry mechanisms for failed operations

## Acceptance Criteria
- All CRUD operations work correctly
- Form validation prevents invalid data submission
- Loading states are shown during API operations
- Error states are handled appropriately
- Success feedback is provided to the user