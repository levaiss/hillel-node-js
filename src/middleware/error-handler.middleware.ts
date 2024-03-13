// Core
import { NextFunction, Request, Response } from 'express';
import { MongooseError } from 'mongoose';

// Helpers
import { RequestStatusCodes } from '../const/request-status-codes';
import { CustomError } from '../errors';

export function errorHandlerMiddleware(error: Error | CustomError | never, req: Request, res: Response, next: NextFunction) {
  let code: number = RequestStatusCodes.BadRequest;
  let message: string = 'Something went wrong';
  let data = null;

  if (error instanceof CustomError) {
    code = error.code;
    message = error.message;
    data = error.data;
  }

  if (error instanceof MongooseError) {
    code = RequestStatusCodes.Validation;
    message = error.message;
    data = error;
  }

  res.status(code).json({
    message,
    data,
  });

  next();
}
