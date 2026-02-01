class ApplicationException extends Error {
    public readonly status: number
    public readonly err_details: any

    constructor(message = "Application error", status = 500, err_details?: any, cause?: unknown) {
        super(message, { cause })
        this.status = status
        this.err_details = err_details
        this.name = this.constructor.name
        Error.captureStackTrace?.(this, this.constructor)
    }
}

class BadRequestException extends ApplicationException {
    constructor(
        message = "Invalid syntax, could be a broken JSON",
        err_details?: any,
        cause?: unknown
    ) {
        super(message, 400, err_details, cause)
    }
}

class UnauthorizedException extends ApplicationException {
    constructor(message = "Client has not been authenticated", err_details?: any, cause?: unknown) {
        super(message, 401, err_details, cause)
    }
}

class ForbiddenException extends ApplicationException {
    constructor(
        message = "Unauthorized access due to insufficient permissions",
        err_details?: any,
        cause?: unknown
    ) {
        super(message, 403, err_details, cause)
    }
}

class NotFoundException extends ApplicationException {
    constructor(message = "Resource is not found", err_details?: any, cause?: unknown) {
        super(message, 404, err_details, cause)
    }
}

class UserNotFoundException extends NotFoundException {
    constructor(message = "User not found", err_details?: any, cause?: unknown) {
        super(message, err_details, cause)
        this.name = this.constructor.name
    }
}

class ConflictException extends ApplicationException {
    constructor(message = "Conflict", err_details?: any, cause?: unknown) {
        super(message, 409, err_details, cause)
    }
}

class ExpiredException extends ApplicationException {
    constructor(message = "Expired", err_details?: any, cause?: unknown) {
        super(message, 410, err_details, cause)
    }
}

class ValidationException extends ApplicationException {
    constructor(message = "Validation failed", err_details?: any, cause?: unknown) {
        super(message, 422, err_details, cause)
    }
}

class RateLimitException extends ApplicationException {
    constructor(message = "Too many requests", err_details?: any, cause?: unknown) {
        super(message, 429, err_details, cause)
    }
}

class InternalServerException extends ApplicationException {
    constructor(message = "Internal server error", err_details?: any, cause?: unknown) {
        super(message, 500, err_details, cause)
    }
}

export {
    ApplicationException,
    BadRequestException,
    ConflictException,
    ExpiredException,
    ForbiddenException,
    InternalServerException,
    NotFoundException,
    RateLimitException,
    UnauthorizedException,
    UserNotFoundException,
    ValidationException,
}
