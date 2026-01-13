from sqlmodel import Session, select
from typing import List, Optional
from src.models.task_model import Task, TaskCreate, TaskUpdate, TaskRead
from src.utils import log_error
from fastapi import HTTPException, status


def create_task(*, session: Session, task_in: TaskCreate, user_id: str) -> TaskRead:
    """
    Create a new task for a specific user.
    """
    try:
        task = Task.from_orm(task_in) if hasattr(Task, 'from_orm') else Task.model_validate(task_in)
        task.user_id = user_id
        session.add(task)
        session.commit()
        session.refresh(task)
        return task
    except Exception as e:
        log_error(e, "Error creating task")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating task"
        )


def get_tasks(*, session: Session, user_id: str, status_filter: Optional[str] = None, sort_by: Optional[str] = None) -> List[TaskRead]:
    """
    Get all tasks for a specific user, with optional filtering and sorting.
    """
    try:
        statement = select(Task).where(Task.user_id == user_id)

        # Apply status filter if provided
        if status_filter and status_filter != "all":
            if status_filter == "pending":
                statement = statement.where(Task.completed == False)
            elif status_filter == "completed":
                statement = statement.where(Task.completed == True)

        # Apply sorting if provided
        if sort_by == "title":
            statement = statement.order_by(Task.title)
        elif sort_by == "created":
            statement = statement.order_by(Task.created_at.desc())  # Most recent first
        else:
            # Default sort by creation date (most recent first)
            statement = statement.order_by(Task.created_at.desc())

        tasks = session.exec(statement).all()
        return tasks
    except Exception as e:
        log_error(e, "Error getting tasks")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error getting tasks"
        )


def get_task_by_id(*, session: Session, task_id: int, user_id: str) -> Optional[TaskRead]:
    """
    Get a specific task by ID for a specific user.
    """
    try:
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = session.exec(statement).first()
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        return task
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        log_error(e, "Error getting task by ID")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error getting task"
        )


def update_task(*, session: Session, task_id: int, task_in: TaskUpdate, user_id: str) -> TaskRead:
    """
    Update a specific task for a specific user.
    """
    try:
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = session.exec(statement).first()
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        # Update only the fields that are provided
        for field, value in task_in.model_dump(exclude_unset=True).items():
            setattr(task, field, value)

        task.updated_at = type(task).updated_at.__class__(default_factory=lambda: __import__('datetime').datetime.utcnow)()
        session.add(task)
        session.commit()
        session.refresh(task)
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


def delete_task(*, session: Session, task_id: int, user_id: str) -> bool:
    """
    Delete a specific task for a specific user.
    """
    try:
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = session.exec(statement).first()
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        session.delete(task)
        session.commit()
        return True
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        log_error(e, "Error deleting task")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting task"
        )


def toggle_task_completion(*, session: Session, task_id: int, user_id: str) -> TaskRead:
    """
    Toggle the completion status of a specific task for a specific user.
    """
    try:
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = session.exec(statement).first()
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        task.completed = not task.completed
        task.updated_at = type(task).updated_at.__class__(default_factory=lambda: __import__('datetime').datetime.utcnow)()
        session.add(task)
        session.commit()
        session.refresh(task)
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