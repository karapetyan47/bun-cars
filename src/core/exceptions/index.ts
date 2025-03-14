export abstract class Exception extends Error {
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  statusCode: number;
}

export class UnauthorizedException extends Exception {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenException extends Exception {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundException extends Exception {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

export class InternalServerErrorException extends Exception {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

export class BadRequestException extends Exception {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}
