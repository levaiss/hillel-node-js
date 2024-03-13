// Core
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';

// Models
import UserModel, { IUserModel } from '../database/model/user.model';

// Helpers
import { accessTokenSecretKey, refreshTokenSecretKey } from '../../config/jwt.config';

export const AUTH_STRATEGIES_TYPE = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

export type AuthStrategiesType = (typeof AUTH_STRATEGIES_TYPE)[keyof typeof AUTH_STRATEGIES_TYPE];

export default class AuthService {
  static getAccessTokenStrategy() {
    const accessTokenStrategyOption = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: accessTokenSecretKey,
    };

    return new Strategy(accessTokenStrategyOption, async (payload, done) => {
      try {
        const user = await UserModel.findById(payload.userId).select('-password');

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (e) {
        console.error('[AccessTokenStrategy]', e);
      }
    });
  }

  static getRefreshTokenStrategy() {
    const refreshTokenStrategyOption = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshTokenSecretKey,
    };

    return new Strategy(refreshTokenStrategyOption, async (payload, done) => {
      try {
        const user = await UserModel.findById(payload.userId).select('-password');

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (e) {
        console.error('[RefreshTokenStrategy]', e);
      }
    });
  }

  static createAccessToken(user: IUserModel): string {
    const { username, _id: userId } = user;

    return `Bearer ${jwt.sign(
      {
        username,
        userId,
      },
      accessTokenSecretKey,
      { expiresIn: '1h' },
    )}`;
  }

  static createRefreshToken(user: IUserModel): string {
    const { username, _id: userId } = user;

    return `Bearer ${jwt.sign(
      {
        username,
        userId,
      },
      refreshTokenSecretKey,
      { expiresIn: '7d' },
    )}`;
  }
}
