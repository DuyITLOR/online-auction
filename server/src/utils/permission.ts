import { verify } from 'crypto';
import { googleCallback } from '../controllers/authControllers';
import { acceptRequest, refuseRequest } from '../controllers/userControllers';

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
    method: 'GET',
  },

  getUserById: {
    path: '/users',
    role: [Role.BIDDER, Role.ADMIN, Role.SELLER],
    method: 'GET',
    request: {},
  },
  updateUser: {
    path: '/users/update',
    role: [Role.BIDDER, Role.ADMIN, Role.SELLER],
    method: 'PATCH',
    request: {
      fullname: 'string',
      password: 'string',
      avtUrl: 'string',
    },
  },
  requestUpgrade: {
    path: '/users/upgrade',
    role: [Role.BIDDER],
    method: 'POST',
    request: {
      note: 'string',
    },
  },
  acceptRequest: {
    path: '/users/upgrade/:requestId/accept',
    role: [Role.ADMIN],
    method: 'PATCH',
  },
  refuseRequest: {
    path: '/users/upgrade/:requestId/refuse',
    role: [Role.ADMIN],
    method: 'PATCH',
  },
};

//
export const HttpStatus = {
  // --- 1xx Informational ---
  continue: 100,
  switchingProtocols: 101,
  processing: 102,
  earlyHints: 103,

  // --- 2xx Success ---
  ok: 200,
  created: 201,
  accepted: 202,
  nonAuthoritativeInformation: 203,
  noContent: 204,
  resetContent: 205,
  partialContent: 206,
  multiStatus: 207,
  alreadyReported: 208,
  imUsed: 226,

  // --- 3xx Redirection ---
  multipleChoices: 300,
  movedPermanently: 301,
  found: 302,
  seeOther: 303,
  notModified: 304,
  temporaryRedirect: 307,
  permanentRedirect: 308,

  // --- 4xx Client Error ---
  badRequest: 400,
  unauthorized: 401,
  paymentRequired: 402,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  notAcceptable: 406,
  proxyAuthenticationRequired: 407,
  requestTimeout: 408,
  conflict: 409,
  gone: 410,
  lengthRequired: 411,
  preconditionFailed: 412,
  payloadTooLarge: 413,
  uriTooLong: 414,
  unsupportedMediaType: 415,
  rangeNotSatisfiable: 416,
  expectationFailed: 417,
  imATeapot: 418,
  misdirectedRequest: 421,
  unprocessableEntity: 422,
  locked: 423,
  failedDependency: 424,
  tooEarly: 425,
  upgradeRequired: 426,
  preconditionRequired: 428,
  tooManyRequests: 429,
  requestHeaderFieldsTooLarge: 431,
  unavailableForLegalReasons: 451,

  // --- 5xx Server Error ---
  internalServerError: 500,
  notImplemented: 501,
  badGateway: 502,
  serviceUnavailable: 503,
  gatewayTimeout: 504,
  httpVersionNotSupported: 505,
  variantAlsoNegotiates: 506,
  insufficientStorage: 507,
  loopDetected: 508,
  notExtended: 510,
  networkAuthenticationRequired: 511,
} as const;
export const API_PRODUCT_ROUTES = {
  createProduct: {
    path: '/product',
    role: [Role.SELLER],
    method: 'POST',
  },


  updateProduct: {
      path: '/product/:id',
      role: [Role.SELLER],
      method: 'PATCH',
  },

  getProduct:{
    path: '/product',
    role: [Role.ALL],
    method: 'GET',
  },

  getProductById: {
    path: '/product/:id',
    role: [Role.ALL],
    method: 'GET',
  }, 

  deleteProduct: {
    path: '/product/:id',
    role: [Role.SELLER, Role.ADMIN],
    method: 'DELETE',
  }

}
