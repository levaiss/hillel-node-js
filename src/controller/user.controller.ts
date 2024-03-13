// Core
import { NextFunction, Request, Response } from 'express';

// Services
import AuthService from '../service/auth';

// Models
import UserModel, { IUserModel } from '../service/database/model/user.model';

// Helpers
import { BadRequestError } from '../errors';
import { RequestStatusCodes } from '../const/request-status-codes';

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password, email } = req.body;

    const user = new UserModel({
      username,
      password,
      email,
    });
    await user.save();

    const accessToken = AuthService.createAccessToken(user);
    const refreshToken = AuthService.createRefreshToken(user);

    res.status(RequestStatusCodes.Created).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body;

  const existingUser = await UserModel.findOne({ username });
  if (!existingUser) {
    return next(new BadRequestError('Username or password is incorrect'));
  }

  const isPasswordValid = existingUser.validPassword(password);
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
  const user = req.user as IUserModel;

  const accessToken = AuthService.createAccessToken(user);

  res.status(RequestStatusCodes.Success).json({
    accessToken,
  });
}
