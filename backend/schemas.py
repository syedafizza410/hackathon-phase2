# backend/schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from pydantic import ConfigDict


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    completed: bool
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginationMeta(BaseModel):
    total: int
    page: int
    pageSize: int
    totalPages: int


class GetTasksResponse(BaseModel):
    success: bool
    data: List[TaskResponse]
    meta: Optional[PaginationMeta] = None


class CreateTaskRequest(BaseModel):
    title: str
    description: Optional[str] = None


class CreateTaskResponse(BaseModel):
    success: bool
    data: TaskResponse


class UpdateTaskRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class UpdateTaskResponse(BaseModel):
    success: bool
    data: TaskResponse


class DeleteTaskResponse(BaseModel):
    success: bool
    data: dict


class ToggleTaskCompletionRequest(BaseModel):
    completed: bool


class ToggleTaskCompletionResponse(BaseModel):
    success: bool
    data: TaskResponse


class GetTaskByIdResponse(BaseModel):
    success: bool
    data: TaskResponse


class GetTasksRequest(BaseModel):
    status: Optional[str] = None
    sort: Optional[str] = None
    page: Optional[int] = 1
    pageSize: Optional[int] = 10
