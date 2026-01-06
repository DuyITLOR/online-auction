import './App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/auth/AuthCallback';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Verify from './pages/auth/Verify';
import ProductList from './pages/product/ListProducts';
import Admin from './pages/admin/Admin';
import Profile from './pages/Profile';
import DetailProduct from './pages/product/DetailProduct';
import ForgetPassword from './pages/auth/ForgetPassword';
import ResetPassword from './pages/auth/ResetPassword';
import PostProduct from './pages/product/PostProduct';
import SellerDashboard from './pages/seller/Dashboard';
import PaymentPage from './pages/payment/PaymentPage';
import MainLayout from './layouts/MainLayout';
import NotFoundPage from './pages/NotFound';
import ShopPage from './pages/product/ShopProduct';
import ChatPage from './pages/chat/ChatPage';
import RatingPage from './pages/RatingPage';
import { ProfileSummaryRoute } from './pages/profileSumary';
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='auth/signin' element={<SignIn />} />
      <Route path='auth/signup' element={<SignUp />} />
      <Route path='auth/verify' element={<Verify />} />
      <Route path='auth/forget-password' element={<ForgetPassword />} />
      <Route path='auth/reset-password' element={<ResetPassword />} />
      <Route path='/' element={<MainLayout />} errorElement={<NotFoundPage />}>
        <Route index element={<Dashboard />} />
        <Route path='products' element={<ProductList />} />
        <Route path='product/:id' element={<DetailProduct />} />
        <Route path='/shop/:sellerId' element={<ShopPage />} />
        <Route path='post-product' element={<PostProduct />} />
        <Route path='admin/dashboard' element={<Admin />} />
        <Route path='auth/google/callback' element={<AuthCallback />} />
        <Route path='products' element={<ProductList />} />
        <Route path='profile' element={<Profile />} />
        <Route path='rating/:id' element={<RatingPage />} />
        <Route path='payment/:id' element={<PaymentPage />} />
        <Route path='seller/dashboard' element={<SellerDashboard />} />
        <Route path='profile/:userId' element={<ProfileSummaryRoute />} />
      </Route>
      <Route path='chat' element={<ChatPage />} />
    </>
  )
);

const App = () => (
  <>
    <RouterProvider router={router} />
  </>
);

export default App;
