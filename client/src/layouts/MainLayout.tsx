import { Outlet } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';

const MainLayout = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
