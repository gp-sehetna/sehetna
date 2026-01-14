from starlette import status


class AppException(Exception):
    """Base exception"""

    status_code: int = ...
    code: str = "APP_ERROR"

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class BadRequest(AppException):
    """Bad request exception"""

    status_code: int = status.HTTP_400_BAD_REQUEST
    code: str = "BAD_REQUEST"


class NotFound(AppException):
    """Resource not found exception"""

    status_code: int = status.HTTP_404_NOT_FOUND
    code: str = "NOT_FOUND"


class Conflict(AppException):
    """Resource conflict exception"""

    status_code: int = status.HTTP_409_CONFLICT
    code: str = "CONFLICT"


class Unauthorized(AppException):
    """Unauthorized access exception"""

    status_code: int = status.HTTP_401_UNAUTHORIZED
    code: str = "UNAUTHORIZED"


class ServiceUnavailable(AppException):
    """Service unavailable exception"""

    status_code: int = status.HTTP_503_SERVICE_UNAVAILABLE
    code: str = "SERVICE_UNAVAILABLE"
