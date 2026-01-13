from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlmodel import Session
from src.db import get_session
from src.models.task_model import Task, TaskCreate, TaskUpdate, TaskRead
from src.api.deps import get_current_user_id
from src.services.task_service import (
    create_task,
    get_tasks,
    get_task_by_id,
    update_task,
    delete_task,
    toggle_task_completion
)
from src.utils import log_error

router = APIRouter()

@router.get("/", response_model=List[TaskRead])
def read_tasks(
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session),
    status_filter: Optional[str] = None,
    sort_by: Optional[str] = None
):
    """
    Retrieve tasks for the authenticated user.
    Supports filtering by status ('all', 'pending', 'completed') and sorting ('created', 'title').
    """
    try:
        # Validate filter parameters
        if status_filter and status_filter not in ["all", "pending", "completed"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status filter. Use 'all', 'pending', or 'completed'."
            )

        if sort_by and sort_by not in ["created", "title"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid sort parameter. Use 'created' or 'title'."
            )

        tasks = get_tasks(
            session=session,
            user_id=current_user_id,
            status_filter=status_filter,
            sort_by=sort_by
        )
        return tasks
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        log_error(e, "Error reading tasks")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving tasks"
        )


@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_new_task(
    task_in: TaskCreate,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.
    """
    try:
        # Validate title length (1-200 characters)
        if not (1 <= len(task_in.title) <= 200):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title must be between 1 and 200 characters."
            )

        # Validate description length if provided (max 1000 characters)
        if task_in.description and len(task_in.description) > 1000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Description must be no more than 1000 characters."
            )

        task = create_task(
            session=session,
            task_in=task_in,
            user_id=current_user_id
        )
        return task
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        log_error(e, "Error creating task")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating task"
        )


@router.get("/{task_id}", response_model=TaskRead)
def read_task(
    task_id: int,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID for the authenticated user.
    """
    try:
        task = get_task_by_id(
            session=session,
            task_id=task_id,
            user_id=current_user_id
        )
        return task
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        log_error(e, "Error reading task by ID")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving task"
        )


@router.put("/{task_id}", response_model=TaskRead)
def update_existing_task(
    task_id: int,
    task_in: TaskUpdate,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Update a specific task for the authenticated user.
    """
    try:
        # Validate title length if provided (1-200 characters)
        if task_in.title is not None and not (1 <= len(task_in.title) <= 200):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title must be between 1 and 200 characters."
            )

        # Validate description length if provided (max 1000 characters)
        if task_in.description and len(task_in.description) > 1000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Description must be no more than 1000 characters."
            )

        task = update_task(
            session=session,
            task_id=task_id,
            task_in=task_in,
            user_id=current_user_id
        )
        return task
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        log_error(e, "Error updating task")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating task"
        )


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_task(
    task_id: int,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task for the authenticated user.
    """
    try:
        success = delete_task(
            session=session,
            task_id=task_id,
            user_id=current_user_id
        )
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        log_error(e, "Error deleting task")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting task"
        )


@router.patch("/{task_id}/complete", response_model=TaskRead)
def toggle_task_completion_status(
    task_id: int,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a specific task for the authenticated user.
    """
    try:
        task = toggle_task_completion(
            session=session,
            task_id=task_id,
            user_id=current_user_id
        )
        return task
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        log_error(e, "Error toggling task completion")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error toggling task completion"
        )