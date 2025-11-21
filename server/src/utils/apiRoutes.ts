export const API_ROUTES = {
  root: '/',
  health: '/health',

  signIn: '/sign-in',
  signUp: '/sign-up',
  verifyEmail: '/verify-email',
  updateUser: '/update-user',

  userById: '/user/:userId',

  getAllCategories: '/categories',
  getCategoryById: '/categories/:categoryId',
  createCategory: '/categories',
  updateCategory: '/categories/:categoryId',
  deleteCategory: '/categories/:categoryId',
  findParentCategories: '/categories/parent',
  findChildCategories: '/categories/child',
  findProductsByCategory: '/categories/products',

};
