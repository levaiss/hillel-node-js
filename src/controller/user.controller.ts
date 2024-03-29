// Core
import { NextFunction, Request, Response } from 'express';

// Services
import AuthService from '../service/auth';

// Models
import UserModel, { IUser } from '../service/database/model/user.model';

// Helpers
import { BadRequestError } from '../errors';
import { RequestStatusCodes } from '../const/request-status-codes';

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const { username, password, email } = req.body;

  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    return next(new BadRequestError('Username already exists'));
  }

  const hashedPassword = await AuthService.createHashedPassword(password);
  const user = new UserModel({
    username,
    password: hashedPassword,
    email,
  });
  await user.save();

  const accessToken = AuthService.createAccessToken(user);
  const refreshToken = AuthService.createRefreshToken(user);

  res.status(RequestStatusCodes.Created).json({
    accessToken,
    refreshToken,
  });
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body;

  const existingUser = await UserModel.findOne({ username });
  if (!existingUser) {
    return next(new BadRequestError('Username or password is incorrect'));
  }

  const isPasswordValid = AuthService.comparePassword(existingUser.password, password);
  if (!isPasswordValid) {
    return next(new BadRequestError('Username or password is incorrect'));
  }

  const accessToken = AuthService.createAccessToken(existingUser);
  const refreshToken = AuthService.createRefreshToken(existingUser);

  res.status(RequestStatusCodes.Success).json({
    accessToken,
    refreshToken,
  });
}

export function getUser(req: Request, res: Response) {
  const { user } = req;

  res.status(RequestStatusCodes.Success).json({
    user,
  });
}

export function updateRefreshToken(req: Request, res: Response) {
  const { user } = req;

  const accessToken = AuthService.createAccessToken(user as IUser);

  res.status(RequestStatusCodes.Success).json({
    accessToken,
  });
}
