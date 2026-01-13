from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt.exceptions import InvalidTokenError
from sqlmodel import Session
from typing import Optional
from src.db import get_session
from src.models.task_model import Task
from src.utils import log_error
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize the HTTP Bearer security scheme
security = HTTPBearer()

# Get the secret key from environment variables
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
if not SECRET_KEY:
    raise ValueError("BETTER_AUTH_SECRET environment variable is not set")

ALGORITHM = "HS256"

def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> str:
    """
    Verify JWT token and extract user_id from the 'sub' claim.
    Returns the user_id if valid, raises HTTPException otherwise.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id
    except InvalidTokenError:
        log_error(InvalidTokenError, "JWT token validation failed")
        raise credentials_exception
    except Exception as e:
        log_error(e, "Error during JWT verification")
        raise credentials_exception