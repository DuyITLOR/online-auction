import { Outlet } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className='flex-1'>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
