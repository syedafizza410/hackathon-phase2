# backend/utils.py
from typing import Dict, Any, List
from datetime import datetime
from models import Task

def format_task_response(task: Task) -> Dict[str, Any]:
    """Format a task object to match the frontend schema."""
    try:
        return {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "createdAt": task.created_at,   # Return datetime object directly
            "updatedAt": task.updated_at    # Return datetime object directly
        }
    except Exception as e:
        print(f"Error formatting task: {e}")
        raise

def format_tasks_response(tasks: List[Task]) -> List[Dict[str, Any]]:
    """Format a list of task objects to match the frontend schema."""
    try:
        return [format_task_response(task) for task in tasks]
    except Exception as e:
        print(f"Error formatting tasks: {e}")
        raise

def calculate_pagination_meta(total_count: int, page: int, page_size: int) -> Dict[str, Any]:
    """Calculate pagination metadata."""
    try:
        total_pages = (total_count + page_size - 1) // page_size
        return {
            "total": total_count,
            "page": page,
            "pageSize": page_size,
            "totalPages": total_pages
        }
    except Exception as e:
        print(f"Error calculating pagination meta: {e}")
        raise
