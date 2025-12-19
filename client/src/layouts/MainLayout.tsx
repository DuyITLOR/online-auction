import { Outlet } from 'react-router-dom';
import Header from '../components/header';

const MainLayout = () => {
  return (
    <>
      <Header/>
      <Outlet />
    </>
  );
};

export default MainLayout;
