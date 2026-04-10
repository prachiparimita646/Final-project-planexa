import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../pages/public/Footer';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;