import './App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route index element={<Dashboard />} />
    </Route>
  )
);

const App = () => (
  <>
    <RouterProvider router={router} />;
  </>
);

export default App;
