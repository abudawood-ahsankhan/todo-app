import logging
from fastapi import HTTPException, status
from datetime import datetime
import traceback
from typing import Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def log_error(error: Exception, context: Optional[str] = None):
    """Log an error with context and traceback"""
    error_msg = f"Error in {context}: {str(error)}" if context else f"Error: {str(error)}"
    logger.error(error_msg)
    logger.error(f"Traceback: {traceback.format_exc()}")

def create_error_response(status_code: int, detail: str):
    """Create a standardized error response"""
    return HTTPException(
        status_code=status_code,
        detail=detail
    )

def log_info(message: str, context: Optional[str] = None):
    """Log an informational message"""
    log_msg = f"{context}: {message}" if context else message
    logger.info(log_msg)

def log_debug(message: str, context: Optional[str] = None):
    """Log a debug message"""
    log_msg = f"{context}: {message}" if context else message
    logger.debug(log_msg)