import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as repo from '../repositories/authRepo';

const JWT_SECRET = process.env.JWT_SECRET;

const hashPassword = async (password: string) => {
  const saltRound = 5;
  const hashed = await bcrypt.hash(password, saltRound);
  return hashed;
};

const getName = async (email: string) => {
  const index = email.indexOf('@');
  if (index === -1) return 'No name';
  const name = email.slice(0, index);
  return name;
};

const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

export const generateToken = async (email: string, password: string) => {
  if (!JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
  }
  const user = await repo.getUserByEmail(email);
  if (!user)
    return {
      success: false,
      token: null,
      message: 'Invalid email',
    };
  const hashed = user.password || '';
  const isMatched = await comparePassword(password, hashed);
  if (isMatched) {
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });
    return {
      success: true,
      token: token,
      message: 'success',
    };
  } else {
    return {
      success: false,
      token: null,
      message: 'Invalid password',
    };
  }
};

export const checkExistEmail = async (email: string) => {
  const user = await repo.getUserByEmail(email);
  return user ? true : false;
};

export const addNewBidder = async (
  email: string,
  password: string,
  fullname: string
) => {
  if (!JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
  }
  const hashed = await hashPassword(password);
  try {
    const user = await repo.addBidder(email, hashed, fullname);
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });
    return {
      success: true,
      token: token,
      message: 'Create new user',
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
      };
    }
    return {
      success: false,
      message: 'unknown error',
    };
  }
};
