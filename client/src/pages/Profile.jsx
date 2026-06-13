import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl max-w-container-max mx-auto px-6 md:px-margin-desktop">
      <div className="border-b border-outline-variant/20 pb-4 mb-8">
        <h1 className="font-headline-sm sm:font-headline-md font-bold text-on-surface">My Account</h1>
        <p className="text-xs text-on-surface-variant mt-1">Manage your account details and view your activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-start">
        {/* Left Column - User Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-outline-variant/30 rounded-3xl p-8 text-center shadow-sm hover:shadow-md transition-all">
            <div className="relative w-28 h-28 mx-auto mb-6">
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-primary/20">
                {user.username?.charAt(0).toUpperCase()}
              </div>
            </div>
            <h2 className="text-xl font-bold text-on-surface">{user.username}</h2>
            <p className="text-sm text-on-surface-variant font-medium mb-4">{user.email}</p>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold capitalize tracking-wider">
              {user.userType === 'admin' ? 'Administrator' : 'Customer'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-error/20 text-error hover:bg-error/5 transition-all font-bold text-sm active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span> Logout Account
          </button>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">package_2</span> Recent Orders
              </h3>
              <Link to="/orders" className="text-primary text-xs font-bold hover:underline">
                View History
              </Link>
            </div>
            <p className="text-on-surface-variant text-sm font-medium">
              Check the status of your recent transactions and download invoices.
            </p>
            <div className="pt-2">
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-all text-xs"
              >
                <span className="material-symbols-outlined text-[16px]">receipt_long</span> Go to Order History
              </Link>
            </div>
          </div>

          <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-3">
              <span className="material-symbols-outlined text-secondary">settings</span> Account Settings
            </h3>
            <p className="text-on-surface-variant text-sm font-medium">
              Profile editing, password changes, and communication preferences will be available soon.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
