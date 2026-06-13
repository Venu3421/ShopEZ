import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-surface-container-highest border-b border-outline-variant shadow-sm py-4 px-6 md:px-margin-desktop" id="admin-top-nav">
      <div className="flex justify-between items-center max-w-container-max mx-auto">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5 group">
          <img
            src="/shopez-logo.png"
            alt="ShopEZ"
            className="h-9 w-9 object-contain group-hover:scale-110 transition-transform"
          />
          <span className="font-display-lg text-[20px] font-bold text-primary tracking-tight">
            ShopEZ Admin Portal
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/admin/dashboard" className="text-sm font-semibold hover:text-primary transition-colors text-on-surface">Dashboard</Link>
          <Link to="/admin/products" className="text-sm font-semibold hover:text-primary transition-colors text-on-surface">Products</Link>
          <Link to="/admin/orders" className="text-sm font-semibold hover:text-primary transition-colors text-on-surface">Orders</Link>
          <Link to="/admin/users" className="text-sm font-semibold hover:text-primary transition-colors text-on-surface">Users</Link>
          <button
            onClick={handleLogout}
            className="text-sm font-bold text-error hover:underline flex items-center gap-1 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
