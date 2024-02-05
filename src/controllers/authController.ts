import { UserModel, IUser } from '../models/UserModel';
import { NotFoundError } from '../utils/error-handler';

export async function authenticateUser(username: string, password: string): Promise<IUser> {
  const userInfo = await UserModel.getByUsername(username);
  if (userInfo && userInfo.password === password) {
    return userInfo;
  }

  throw new NotFoundError('User not found!', null);
}
