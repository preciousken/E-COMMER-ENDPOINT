import { Keyable } from '../utilities/interface';
import User from '../models/user';
import { makeResponse } from '../utilities/response';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';

const findUserByEmail = async (email: string): Promise<any> => {
  return await User.findOne({ email });
};

const findUserByEmailAndUpdate = async (
  email: string,
  data: Keyable
): Promise<any> => {
  return await User.findOneAndUpdate({ email }, data, { new: true });
};

const findUserByIdAndUpdate = async (
  id: string,
  data: Keyable
): Promise<any> => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};

const findUserByEmailAndDelete = async (email: string): Promise<any> => {
  return await User.findOneAndDelete({ email });
};

const findUserById = async (id: string): Promise<any> => {
  return await User.findById(id);
};

const findUserByMatch = async (match: Keyable): Promise<any> => {
  return await User.findOne(match);
};

const generateHashedPassword = (password: string): string => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

const comparePasswordHash = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

const generateJWT = (user: Keyable): string => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1d',
    }
  );
};

const registerUser = async (payload: Keyable): Promise<any> => {
  let existingUser = await findUserByEmail(payload.email.toLowerCase());
  if (existingUser) {
    return makeResponse(false, 'EMAIL_DUPLICATE', {});
  }
  let password = generateHashedPassword(payload.password);
  const user = await new User({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email.toLowerCase(),
    password: password,
    address: payload.address,
  }).save();
  user.set('password', undefined);
  let token = generateJWT(user);
  if (!user) {
    return makeResponse(false, 'REGISTER_FAILED', {});
  }
  return makeResponse(true, 'REGISTER_SUCCESS', { user, token });
};

const loginUser = async (payload: Keyable): Promise<any> => {
  let existingUser = await findUserByEmail(payload.email.toLowerCase());
  if (!existingUser) {
    return makeResponse(false, 'USER_NOT_FOUND', {});
  }
  let password = comparePasswordHash(payload.password, existingUser.password);
  if (!password) {
    return makeResponse(false, 'INVALID_CREDENTIALS', {});
  }
  existingUser.set('password', undefined);
  let token = generateJWT(existingUser);
  return makeResponse(true, 'LOGIN_SUCCESS', { token, user: existingUser });
};

const verifyUserToken = async (token: string): Promise<any> => {
  if (!token) {
    return makeResponse(false, 'TOKEN_ERROR', {});
  }
  try {
    let decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    let user = await findUserById(decoded._id);
    if (!user) {
      return makeResponse(false, 'INVALID_TOKEN', {});
    }
    return makeResponse(true, '', user);
  } catch (error) {
    return makeResponse(false, 'INVALID_TOKEN', {});
  }
};

const updateUser = async (user: Keyable, payload: Keyable): Promise<any> => {
  if (payload.password) {
    payload.password = generateHashedPassword(payload.password);
  }
  if (payload.email && payload.email.toLowerCase() !== user.email.toString()) {
    let existingUser = await findUserByEmail(payload.email.toLowerCase());
    if (existingUser) {
      return makeResponse(false, 'EMAIL_DUPLICATE', {});
    }
    payload.email = payload.email.toLowerCase();
  }
  let existingUser = await findUserByIdAndUpdate(user._id, payload);
  if (!existingUser) {
    return makeResponse(false, 'USER_NOT_FOUND', {});
  }
  existingUser.set('password', undefined);
  return makeResponse(true, 'UPDATE_SUCCESS', { user: existingUser });
};

const findOneUser = async (match: Keyable): Promise<any> => {
  let user = await findUserByMatch(match);
  if (!user) {
    return makeResponse(false, 'USER_NOT_FOUND', {});
  }
  user.set('password', undefined);
  return makeResponse(true, 'USER_QUERY_SUCCESS', user);
};

const destroyAUser = async (email: string): Promise<any> => {
  let existingUser = await findUserByEmailAndDelete(email);
  if (!existingUser) {
    return makeResponse(false, 'USER_NOT_FOUND', {});
  }
  return makeResponse(true, 'USER_DELETE_SUCCESS', {});
};

export {
  registerUser,
  loginUser,
  verifyUserToken,
  updateUser,
  findOneUser,
  destroyAUser,
};
