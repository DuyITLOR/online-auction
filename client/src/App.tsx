import './App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/auth/AuthCallback';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Verify from './pages/auth/Verify';
import ProductList from './pages/product/productList';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route index element={<Dashboard />} />
      <Route path='auth/signin' element={<SignIn />} />
      <Route path='auth/signup' element={<SignUp />} />
      <Route path='auth/verify' element={<Verify />} />
      <Route path='products' element={<ProductList />} />
      <Route path='auth/google/callback' element={<AuthCallback />} />
    </Route>
  )
);

const App = () => (
  <>
    <RouterProvider router={router} />
  </>
);

export default App;
