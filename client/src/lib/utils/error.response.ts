export class ApplicationException extends Error {
    constructor(
        message: string,
        public statusCode: number,
        cause: unknown
    ) {
        super(message, { cause })
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

export class BadRequestException extends ApplicationException {
    constructor(message: string, cause?: unknown) {
        super(message, 400, cause)
    }
}



