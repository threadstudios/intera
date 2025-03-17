class HttpError extends Error {
  public statusCode: number;
  public body: Record<string, unknown> | undefined;

  constructor({
    message,
    statusCode,
    body,
  }: {
    message: string;
    body?: Record<string, unknown> | undefined;
    statusCode: number;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.body = body;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends HttpError {
  constructor({
    message = "Bad Request",
    body,
  }: { message?: string; body?: Record<string, unknown> | undefined } = {}) {
    super({ message, statusCode: 400, body });
  }
}

class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super({ message, statusCode: 401 });
  }
}

class ForbiddenError extends HttpError {
  constructor(message = "Forbidden") {
    super({ message, statusCode: 403 });
  }
}

class NotFoundError extends HttpError {
  constructor(message = "Not Found") {
    super({ message, statusCode: 404 });
  }
}

class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error") {
    super({ message, statusCode: 500 });
  }
}

class NotImplementedError extends HttpError {
  constructor(message = "Not Implemented") {
    super({ message, statusCode: 501 });
  }
}

export {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  NotImplementedError,
};
