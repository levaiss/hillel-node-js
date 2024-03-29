import passport from 'passport';
import { AUTH_STRATEGIES_TYPE, AuthStrategiesType } from '../service/auth';

export function authHandlerMiddleware(strategyName: AuthStrategiesType = AUTH_STRATEGIES_TYPE.ACCESS_TOKEN) {
  return passport.authenticate(strategyName, { session: false });
}
