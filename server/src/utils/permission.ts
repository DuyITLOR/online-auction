import { verify } from 'crypto';
import { googleCallback } from '../controllers/authControllers';
import { updateCate } from '../services/cateService';
import { updateCategory } from '../controllers/categoryControllers';
import { get, request } from 'http';
import {
  createAutoBid,
  getBidHistoryByUserId,
} from '../services/autoBidService';
import { getMaxBidByUser } from '../controllers/autoBiderController';
import path from 'path';
import { getAllCommentsByProductId } from '../controllers/userControllers';
import { getOrderById, uploadBankInfo } from '../services/orderService';
import { activateUser } from '../services/adminService';

enum Role {
  ADMIN = 'ADMIN',
  BIDDER = 'BIDDER',
  SELLER = 'SELLER',
  GUEST = 'GUEST',
  ALL = 'ALL',
}

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
  forgetPassword: {
    path: '/forget-password',
    role: [Role.ALL],
    method: 'POST',
    request: {
      email: 'string',
    },
  },
  updatePassword: {
    path: '/update-password',
    role: [Role.BIDDER, Role.SELLER, Role.ADMIN],
    method: 'POST',
    request: {
      oldPassword: 'string',
      newPassword: 'string',
    },
  },
  resetPassword: {
    path: '/reset-password',
    role: [Role.ADMIN, Role.BIDDER, Role.SELLER],
    method: 'POST',
    request: {
      password: 'string',
    },
  },

  // User permission
  getUserById: {
    path: '/users',
    role: [Role.BIDDER, Role.ADMIN, Role.SELLER],
    method: 'GET',
    request: {},
  },
  getUserInformation: {
    path: '/users/:userId',
    role: [Role.ALL],
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
  blockBidder: {
    path: '/users/:userId/blocked', // userId here is the bidder you want to block from bidding
    role: [Role.SELLER],
    method: 'POST',
    request: {
      productId: 'string',
      reason: 'string',
    },
  },
  askSeller: {
    path: '/products/:productId/ask',
    role: [Role.BIDDER],
    method: 'POST',
    request: {
      question: 'string',
    },
  },
  answerBidder: {
    path: '/comments/:commentId/answer',
    role: [Role.SELLER],
    method: 'POST',
    request: {
      answer: 'string',
    },
  },
  getAllCommentsByProductId: {
    path: '/comments/products/:productId',
    role: [Role.ALL],
    method: 'GET',
  },
  deleteComment: {
    path: '/comments/:commentId',
    role: [Role.BIDDER, Role.ADMIN, Role.SELLER],
    method: 'DELETE',
  },
  getAllBlockedUser: {
    path: '/users/blocked/products/:productId',
    role: [Role.SELLER, Role.ADMIN],
    method: 'GET',
  },
  // Seller permission

  getSellerStatistics: {
    path: '/sellers/stats',
    role: [Role.BIDDER, Role.SELLER, Role.ADMIN],
    method: 'GET',
  },
  // Admin permission
  getAllUsers: {
    path: '/admin/users', // Có thể thêm query param limit và page để phân trang
    role: [Role.ADMIN],
    method: 'GET',
  },
  getAllRequest: {
    path: '/users/requests',
    role: [Role.ADMIN],
    method: 'GET',
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
  getAdminDashboardData: {
    path: '/admin/data',
    role: [Role.ADMIN],
    method: 'GET',
  },
  getAllDeactivatedUsers: {
    path: '/users/deactivated',
    role: [Role.ADMIN],
    method: 'GET',
  },
  profileSummary: {
    path: '/bidder/statistic',
    role: [Role.ALL],
    method: 'GET',
  },
  deactivateUser: {
    path: '/users/:userId/deactivate',
    role: [Role.ADMIN],
    method: 'PATCH',
  },
  activateUser: {
    path: '/users/:userId/activate',
    role: [Role.ADMIN],
    method: 'PATCH',
  },

  // system configuration
  getAllSettings: {
    path: '/settings',
    role: [Role.ADMIN],
    method: 'GET',
  },
  createSetting: {
    path: '/settings',
    role: [Role.ADMIN],
    method: 'POST',
    request: {
      key: 'string',
      value: 'string',
    },
  },
  updateSetting: {
    path: '/settings/:settingId',
    role: [Role.ADMIN],
    method: 'PATCH',
    request: {
      value: 'string',
    },
  },
};

export const API_RATING_ROUTES = {
  getAllRatings: {
    path: '/ratings',
    role: [Role.ADMIN, Role.BIDDER, Role.SELLER],
    method: 'GET',
    queryParam: {
      type: {
        // type=received, if you do not pass the type, the default is getting all. (This route not include pagination)
        received: 'returns all ratings that you have received.',
        given: 'returns all ratings that you have given to others.',
      },
    },
  },

  rateUser: {
    path: '/ratings/users/:rateeId',
    role: [Role.BIDDER, Role.SELLER],
    method: 'POST',
    request: {
      productId: 'string',
      value: 'number', // -1 (negative) or 1 (positive)
      comment: 'string',
    },
  },
  updateRating: {
    path: '/ratings/:ratingId',
    role: [Role.BIDDER, Role.SELLER],
    method: 'PATCH',
    request: {
      value: 'number', // -1 (negative) or 1 (positive)
      comment: 'string',
    },
  },
  deleteRating: {
    path: '/ratings/:ratingId',
    role: [Role.BIDDER, Role.SELLER],
    method: 'DELETE',
  },
};

export const API_CHAT_ROUTES = {
  getAllChats: {
    path: '/chats',
    role: [Role.BIDDER, Role.SELLER],
    method: 'GET',
  },
  getMessagesByProduct: {
    path: '/products/:productId/chat',
    role: [Role.BIDDER, Role.SELLER],
    method: 'GET',
  },
  sendMessage: {
    path: '/products/:productId/chat',
    role: [Role.BIDDER, Role.SELLER],
    method: 'POST',
    request: {
      content: 'String',
    },
  },
};

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

  getProduct: {
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
  },
  buyNowProduct: {
    path: '/product/:id/buy-now',
    role: [Role.BIDDER],
    method: 'POST',
  },
  fullTextSearch: {
    path: '/products/search',
    role: [Role.ALL],
    method: 'GET',
  },
};

export const API_CATEGORY_ROUTES = {
  createCategory: {
    path: '/categories',
    role: [Role.ADMIN],
    method: 'POST',
  },

  updateCategory: {
    path: '/categories/:id',
    role: [Role.ADMIN],
    method: 'PATCH',
  },

  getAllCategories: {
    path: '/categories',
    role: [Role.ALL],
    method: 'GET',
  },

  getCategoryById: {
    path: '/categories/:id',
    role: [Role.ALL],
    method: 'GET',
  },
  deleteCategory: {
    path: '/categories/:id',
    role: [Role.ADMIN],
    method: 'DELETE',
  },
  getAllChildProducts: {
    path: '/categories/:parentId/products',
    role: [Role.ALL],
    method: 'GET',
  },
};
export const API_WATCHLIST_ROUTES = {
  addWatchList: {
    path: '/watchlist',
    method: 'POST',
    role: [Role.ALL],
  },

  removeWatchList: {
    path: '/watchlist',
    method: 'DELETE',
    role: [Role.ALL],
  },

  getWatchList: {
    path: '/watchlist',
    method: 'GET',
    role: [Role.ALL],
  },
  getAllWatchList: {
    path: '/watchlists',
    method: 'GET',
    role: [Role.ALL],
  },
};

export const API_AUTO_BID_ROUTES = {
  createAutoBid: {
    path: '/autoBid',
    method: 'POST',
    role: [Role.BIDDER],
  },
  getHistoryAutoBidByProduct: {
    path: '/autoBid/:productId/history',
    method: 'GET',
    role: [Role.ALL],
  },
  getBidCountByProductId: {
    path: '/autoBid/:productId/count',
    method: 'GET',
    role: [Role.ALL],
  },
  getMaxBidByUser: {
    path: '/autoBid/:productId',
    method: 'GET',
    role: [Role.BIDDER],
  },
  getBidHistoryByUserId: {
    path: '/autoBid',
    method: 'GET',
    role: [Role.BIDDER],
  },
};

export const API_ORDER_ROUTES = {
  getOrders: {
    path: '/orders',
    method: 'GET',
    role: [Role.ADMIN, Role.BIDDER, Role.SELLER],
  },
  getOrderById: {
    path: '/orders/:id',
    method: 'GET',
    role: [Role.BIDDER, Role.SELLER],
  },
  getOrderByProductId: {
    path: '/orders/products/:productId',
    method: 'GET',
    role: [Role.BIDDER, Role.SELLER],
  },
  uploadBankInfo: {
    path: '/orders/:id/qr',
    method: 'POST',
    role: [Role.SELLER],
  },
  uploadPayment: {
    path: '/orders/:id/payment',
    method: 'PATCH',
    role: [Role.BIDDER],
  },
  uploadShippingInfo: {
    path: '/orders/:id/shipping',
    method: 'PATCH',
    role: [Role.SELLER],
  },
  confirmOrder: {
    path: '/orders/:id/confirm',
    method: 'PATCH',
    role: [Role.BIDDER],
  },
  cancelOrder: {
    path: '/orders/:id/cancel',
    method: 'PATCH',
    role: [Role.SELLER],
  },
};
