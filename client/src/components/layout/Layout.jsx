import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AdminNavbar from './AdminNavbar';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // Ensure dark class is never set
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('darkMode');
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface transition-colors duration-300">
      {isAdminPage ? <AdminNavbar /> : <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default Layout;
