import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide navbar on login/register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('search') || '');
  }, [location.search]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (location.pathname === '/products') {
      navigate(`/products?search=${encodeURIComponent(val)}`, { replace: true });
    } else {
      navigate(`/products?search=${encodeURIComponent(val)}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={`fixed w-full top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-outline-variant shadow-sm transition-all duration-300 ${isAuthPage ? 'hidden' : ''}`} id="top-nav">
      <div className="flex justify-between items-center px-6 md:px-margin-desktop py-3 max-w-container-max mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/shopez-logo.png"
            alt="ShopEZ"
            className="h-9 w-9 object-contain group-hover:scale-110 transition-transform"
          />
          <span className="font-display-lg text-[22px] font-bold text-primary tracking-tight">
            ShopEZ
          </span>
        </Link>

        {/* Desktop Search + Actions */}
        <div className="flex items-center gap-4">
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all"
          >
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="bg-transparent border-none focus:ring-0 text-body-md w-48 lg:w-64 text-on-surface placeholder:text-on-surface-variant/60 outline-none"
            />
          </form>

          <div className="flex items-center gap-1">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2.5 text-on-surface-variant hover:bg-surface-container-high/50 rounded-full transition-all active:scale-95 relative"
              aria-label="Wishlist"
            >
              <span className="material-symbols-outlined">favorite</span>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-error text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2.5 text-on-surface-variant hover:bg-surface-container-high/50 rounded-full transition-all active:scale-95 relative"
              aria-label="Shopping cart"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Login/Sign Up or Profile Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="p-2.5 text-on-surface-variant hover:bg-surface-container-high/50 rounded-full transition-all active:scale-95"
                  aria-label="User menu"
                >
                  <span className="material-symbols-outlined">account_circle</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-outline-variant bg-white shadow-xl ring-1 ring-black/5 z-50">
                    <div className="py-1">
                      <div className="border-b border-outline-variant px-4 py-3 bg-surface-container-low rounded-t-xl">
                        <p className="text-sm font-semibold text-on-surface">
                          {user.username}
                        </p>
                        <p className="truncate text-xs text-on-surface-variant">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                      >
                        <span className="material-symbols-outlined text-[18px]">settings</span>
                        Profile
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                      >
                        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        Orders
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                      >
                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                        Wishlist
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary transition-colors hover:bg-surface-container-low font-semibold"
                        >
                          <span className="material-symbols-outlined text-[18px]">dashboard</span>
                          Admin Dashboard
                        </Link>
                      )}

                      <div className="border-t border-outline-variant">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-error transition-colors hover:bg-red-50"
                        >
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-semibold text-primary border border-primary rounded-full hover:bg-primary/5 transition-all active:scale-95"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-full hover:brightness-110 transition-all active:scale-95 shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2.5 text-on-surface-variant hover:bg-surface-container-high/50 rounded-full transition-all active:scale-95 md:hidden"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-outline-variant md:hidden bg-white shadow-md">
          <div className="space-y-1 px-6 py-6">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                  className="w-full rounded-full border border-outline-variant bg-surface-container-low py-2.5 pl-10 pr-4 text-sm text-on-surface"
                />
              </div>
            </form>

            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            >
              All Products
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            >
              Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                >
                  Orders
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-secondary hover:bg-surface-container-low"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-error hover:bg-red-50 border border-red-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-outline-variant mt-4">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 border border-primary text-primary rounded-xl hover:bg-primary/5 font-semibold text-sm transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:brightness-110 font-semibold text-sm transition-all shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
