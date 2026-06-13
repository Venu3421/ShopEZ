import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  // Hide footer on login/register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  return (
    <footer className={`bg-surface-container-highest w-full bottom-0 mt-stack-xl border-t border-outline-variant ${isAuthPage ? 'hidden' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-6 md:px-margin-desktop py-stack-xl max-w-container-max mx-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <img src="/shopez-logo.png" alt="ShopEZ" className="h-8 w-8 object-contain" />
            <span className="font-headline-md text-headline-md font-black text-on-surface">
              ShopEZ
            </span>
          </div>
          <p className="text-on-surface-variant font-body-md pr-4">
            Redefining the digital shopping experience with curated premium goods and effortless service.
          </p>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-all" href="#">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-all" href="#">
              <span className="material-symbols-outlined">forum</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-all" href="#">
              <span className="material-symbols-outlined">share</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-label-caps text-label-caps text-primary mb-6">Shop</h4>
          <ul className="space-y-4">
            <li><Link to="/products" className="text-on-surface-variant hover:text-on-surface underline decoration-primary transition-all">New Arrivals</Link></li>
            <li><Link to="/products?sort=discount" className="text-on-surface-variant hover:text-on-surface underline decoration-primary transition-all">Best Sellers</Link></li>
            <li><Link to="/products?sort=discount" className="text-on-surface-variant hover:text-on-surface underline decoration-primary transition-all">Exclusive Deals</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-label-caps text-label-caps text-primary mb-6">Company</h4>
          <ul className="space-y-4">
            <li><a className="text-on-surface-variant hover:text-on-surface underline decoration-primary transition-all" href="#">Careers</a></li>
            <li><a className="text-on-surface-variant hover:text-on-surface underline decoration-primary transition-all" href="#">Affiliates</a></li>
            <li><Link to="/privacy" className="text-on-surface-variant hover:text-on-surface underline decoration-primary transition-all">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-on-surface-variant hover:text-on-surface underline decoration-primary transition-all">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-label-caps text-label-caps text-primary mb-6">Support</h4>
          <ul className="space-y-4">
            <li><a className="text-on-surface-variant hover:text-on-surface underline decoration-primary transition-all" href="#">Shipping Info</a></li>
            <li><a className="text-on-surface-variant hover:text-on-surface underline decoration-primary transition-all" href="#">Returns</a></li>
            <li><a className="text-on-surface-variant hover:text-on-surface underline decoration-primary transition-all" href="#">FAQ</a></li>
            <li><a className="text-on-surface-variant hover:text-on-surface underline decoration-primary transition-all" href="#">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="px-6 md:px-margin-desktop py-8 border-t border-outline-variant/30 text-center text-on-surface-variant font-body-md">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[14px]">© {currentYear} ShopEZ Premium E-commerce. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="material-symbols-outlined text-on-surface-variant/40">payments</span>
            <span className="material-symbols-outlined text-on-surface-variant/40">credit_card</span>
            <span className="material-symbols-outlined text-on-surface-variant/40">account_balance_wallet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
