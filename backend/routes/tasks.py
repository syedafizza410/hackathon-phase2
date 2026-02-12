# backend/routes/tasks.py
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy import func
from starlette import status

from auth import verify_user_id_match
from db import get_session
from models import Task

router = APIRouter()

# ---------------- Pydantic Models ----------------
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

# ---------------- GET All Tasks ----------------
@router.get("/tasks")
def get_tasks(
    user_id: str,
    request: Request,
    status_filter: Optional[str] = None,
    sort: Optional[str] = None,
    page: int = 1,
    pageSize: int = 10,
    session: Session = Depends(get_session),
):
    token_user_id = getattr(request.state, "user_id", None)
    if not token_user_id or not verify_user_id_match(token_user_id, user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    query = select(Task).where(Task.user_id == user_id)

    if status_filter == "active":
        query = query.where(Task.completed == False)
    elif status_filter == "completed":
        query = query.where(Task.completed == True)

    if sort == "created_desc":
        query = query.order_by(Task.created_at.desc())
    elif sort == "created_asc":
        query = query.order_by(Task.created_at.asc())

    offset = (page - 1) * pageSize
    tasks = session.exec(query.offset(offset).limit(pageSize)).all()

    total = session.exec(select(func.count(Task.id)).where(Task.user_id == user_id)).one()

    return {
        "success": True,
        "data": [
            {
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "completed": t.completed,
                "createdAt": t.created_at.isoformat(),
                "updatedAt": t.updated_at.isoformat(),
            }
            for t in tasks
        ],
        "meta": {"total": total, "page": page, "pageSize": pageSize},
    }

# ---------------- POST Create Task ----------------
@router.post("/tasks", status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: str,
    task: TaskCreate,
    request: Request,
    session: Session = Depends(get_session),
):
    token_user_id = getattr(request.state, "user_id", None)
    if not token_user_id or not verify_user_id_match(token_user_id, user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    new_task = Task(
        user_id=user_id,
        title=task.title,
        description=task.description or "",
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    session.add(new_task)
    session.commit()
    session.refresh(new_task)

    return {
        "success": True,
        "data": {
            "id": new_task.id,
            "title": new_task.title,
            "description": new_task.description,
            "completed": new_task.completed,
            "createdAt": new_task.created_at.isoformat(),
            "updatedAt": new_task.updated_at.isoformat(),
        },
    }

# ---------------- GET Task Details ----------------
@router.get("/tasks/{task_id}")
def get_task_detail(user_id: str, task_id: int, request: Request, session: Session = Depends(get_session)):
    token_user_id = getattr(request.state, "user_id", None)
    if not token_user_id or not verify_user_id_match(token_user_id, user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    return {
        "success": True,
        "data": {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "createdAt": task.created_at.isoformat(),
            "updatedAt": task.updated_at.isoformat(),
        },
    }

# ---------------- PUT Update Task ----------------
@router.put("/tasks/{task_id}")
def update_task(user_id: str, task_id: int, task_update: TaskUpdate, request: Request, session: Session = Depends(get_session)):
    token_user_id = getattr(request.state, "user_id", None)
    if not token_user_id or not verify_user_id_match(token_user_id, user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.completed is not None:
        task.completed = task_update.completed

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)

    return {
        "success": True,
        "data": {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "createdAt": task.created_at.isoformat(),
            "updatedAt": task.updated_at.isoformat(),
        },
    }

# ---------------- DELETE Task ----------------
@router.delete("/tasks/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(user_id: str, task_id: int, request: Request, session: Session = Depends(get_session)):
    token_user_id = getattr(request.state, "user_id", None)
    if not token_user_id or not verify_user_id_match(token_user_id, user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    session.delete(task)
    session.commit()
    return {"success": True, "message": "Task deleted successfully"}

# ---------------- PATCH Toggle Completion ----------------
@router.patch("/tasks/{task_id}/complete")
def toggle_complete_task(user_id: str, task_id: int, request: Request, session: Session = Depends(get_session)):
    token_user_id = getattr(request.state, "user_id", None)
    if not token_user_id or not verify_user_id_match(token_user_id, user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)

    return {
        "success": True,
        "data": {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "createdAt": task.created_at.isoformat(),
            "updatedAt": task.updated_at.isoformat(),
        },
    }
