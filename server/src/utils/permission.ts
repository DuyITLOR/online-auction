import { verify } from 'crypto';
import { googleCallback } from '../controllers/authControllers';

enum Role {
  ADMIN = 'ADMIN',
  BIDDER = 'BIDDER',
  SELLER = 'SELLER',
  GUEST = 'GUEST',
  ALL = 'ALL',
}

export const API_ROUTES = {
  root: '/',
  health: '/health',

  signIn: {
    path: '/sign-in',
    role: [Role.ALL],
    method: 'POST',
    request: {
      email: 'string',
      password: 'string',
    },
  },
  signUp: {
    path: '/sign-up',
    role: [Role.ALL],
    method: 'POST',
    request: {
      email: 'string',
    },
  },
  signInViaGoogle: {
    path: '/auth/google',
    role: [Role.ALL],
    method: 'GET',
  },

  googleCallback: {
    path: '/auth/google/callback',
    role: [Role.ALL],
    method: 'GET',
  },
  verifyEmail: {
    path: '/verify-email',
    role: [Role.ALL],
    method: 'POST',
    request: {
      email: 'string',
      fullename: 'string',
      password: 'string',
      code: 'string',
    },
  },

  verifyToken: {
    path: '/auth/verify-token',
    role: [Role.ALL], 
    method: 'GET'
  },

  getUserById: {
    path: '/user',
    role: [Role.BIDDER, Role.ADMIN, Role.SELLER],
    method: 'GET',
    request: {},
  },

  updateUser: {
    path: '/user/update',
    role: [Role.BIDDER, Role.ADMIN, Role.SELLER],
    method: 'POST',
    request: {
      fullname: 'string',
      password: 'string',
      avtUrl: 'string',
    },
  },
};
