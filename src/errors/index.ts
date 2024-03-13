import { RequestStatusCodes } from '../const/request-status-codes';

export class CustomError extends Error {
  code: number;
  data: unknown;

  constructor(message: string, data?: unknown) {
    super(message);

    this.code = RequestStatusCodes.BadRequest;
    this.name = 'CustomError';
    this.data = data;
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string, data?: unknown) {
    super(message, data);

    this.code = RequestStatusCodes.NotFound;
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, data?: unknown) {
    super(message, data);

    this.code = RequestStatusCodes.Validation;
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized', data?: unknown) {
    super(message, data);

    this.code = RequestStatusCodes.Unauthorized;
    this.name = 'UnauthorizedError';
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string, data?: unknown) {
    super(message, data);

    this.code = RequestStatusCodes.BadRequest;
    this.name = 'BadRequestError';
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Access to the requested resource is forbidden', data?: unknown) {
    super(message, data);

    this.code = RequestStatusCodes.Forbidden;
    this.name = 'ForbiddenError';
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string, data?: unknown) {
    super(message, data);

    this.code = RequestStatusCodes.InternalServerError;
    this.name = 'InternalServerError';
  }
}
