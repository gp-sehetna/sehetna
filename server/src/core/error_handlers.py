import logging

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

from src.core.exceptions import AppException

logger = logging.getLogger(__name__)


def app_exception_handler(request: Request, exc: AppException):
    logger.error(f"App exception: {exc.message} (code: {exc.code})")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.message, "status_code": exc.status_code, "code": exc.code, "path": request.url.path},
    )


def unhandled_exception_handler(request: Request, _: Exception):
    # logger.error("Unhandled exception", exc_info=True)
    return JSONResponse(
        status_code=HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "Internal server error", "code": "INTERNAL_ERROR", "path": request.url.path},
    )
