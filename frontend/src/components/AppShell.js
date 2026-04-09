import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const menuItems = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Kính nam', to: '/men' },
  { label: 'Kính nữ', to: '/women' },
  { label: 'Kính trẻ em', to: '/kids' },
];

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {children}
    </svg>
  );
}

function AppShell({ children }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const { items } = useWishlist();

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="container shell-header">
          <Link to="/" className="logo-mark">
            <span className="logo-dot" />
            EYECLASS
          </Link>
          <nav className="desktop-menu">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `menu-link ${isActive ? 'menu-link-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="quick-actions">
            <NavLink className={({ isActive }) => `icon-pill ${isActive ? 'icon-pill-active' : ''}`} to="/wishlist" aria-label="Yêu thích">
              <Icon>
                <path d="M12 20.25c-.3 0-.59-.11-.81-.31l-6.22-5.69A4.67 4.67 0 0 1 12 8.12a4.67 4.67 0 0 1 7.03 6.13l-6.22 5.69c-.22.2-.51.31-.81.31Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </Icon>
              <span>{items.length}</span>
            </NavLink>
            <NavLink className={({ isActive }) => `icon-pill ${isActive ? 'icon-pill-active' : ''}`} to="/cart" aria-label="Giỏ hàng">
              <Icon>
                <path d="M3.75 5.25h1.89c.53 0 1 .36 1.13.87l1.94 7.43c.13.51.6.87 1.13.87h7.89c.53 0 1-.35 1.13-.86l1.24-4.83H8.12" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10.25" cy="18.25" r="1.25" fill="currentColor" />
                <circle cx="17.25" cy="18.25" r="1.25" fill="currentColor" />
              </Icon>
              <span>{cart.totalItems || 0}</span>
            </NavLink>
            <NavLink className={({ isActive }) => `icon-pill ${isActive ? 'icon-pill-active' : ''}`} to="/account" aria-label="Tài khoản">
              <Icon>
                <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.9" />
                <path d="M5.75 18.75c1.15-2.23 3.28-3.5 6.25-3.5s5.1 1.27 6.25 3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </Icon>
            </NavLink>
            {isAuthenticated ? (
              <button className="icon-pill" type="button" onClick={logout} aria-label="Đăng xuất">
                <Icon>
                  <path d="M9.75 5.25H7.5A2.25 2.25 0 0 0 5.25 7.5v9A2.25 2.25 0 0 0 7.5 18.75h2.25" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                  <path d="M13.5 9.25 17 12l-3.5 2.75M17 12H9.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </Icon>
              </button>
            ) : (
              <NavLink className={({ isActive }) => `icon-pill ${isActive ? 'icon-pill-active' : ''}`} to="/login" aria-label="Đăng nhập">
                <Icon>
                  <path d="M14.25 5.25h2.25a2.25 2.25 0 0 1 2.25 2.25v9A2.25 2.25 0 0 1 16.5 18.75h-2.25" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                  <path d="M10.5 9.25 7 12l3.5 2.75M7 12h7.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </Icon>
              </NavLink>
            )}
          </div>
        </div>
        <div className="mobile-tabbar">
          <NavLink to="/" className={({ isActive }) => `tab-link ${isActive ? 'tab-link-active' : ''}`}>
            <Icon>
              <path d="M4.75 10.5 12 4.75l7.25 5.75v7.75a1 1 0 0 1-1 1h-4.5v-5.5h-3.5v5.5h-4.5a1 1 0 0 1-1-1V10.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
            </Icon>
            <span>Home</span>
          </NavLink>
          <NavLink to="/shop" className={({ isActive }) => `tab-link ${isActive ? 'tab-link-active' : ''}`}>
            <Icon>
              <path d="M5.75 7h12.5l-1 12H6.75l-1-12ZM9 7a3 3 0 1 1 6 0" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </Icon>
            <span>Shop</span>
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => `tab-link ${isActive ? 'tab-link-active' : ''}`}>
            <Icon>
              <path d="M3.75 5.25h1.89c.53 0 1 .36 1.13.87l1.94 7.43c.13.51.6.87 1.13.87h7.89c.53 0 1-.35 1.13-.86l1.24-4.83H8.12" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10.25" cy="18.25" r="1.25" fill="currentColor" />
              <circle cx="17.25" cy="18.25" r="1.25" fill="currentColor" />
            </Icon>
            <span>Cart</span>
            <b className="tab-badge">{cart.totalItems || 0}</b>
          </NavLink>
          <NavLink to="/account" className={({ isActive }) => `tab-link ${isActive ? 'tab-link-active' : ''}`}>
            <Icon>
              <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.9" />
              <path d="M5.75 18.75c1.15-2.23 3.28-3.5 6.25-3.5s5.1 1.27 6.25 3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            </Icon>
            <span>Me</span>
          </NavLink>
        </div>
      </header>

      <main className="container page-container">{children}</main>

      <footer className="site-footer">
        <div className="container footer-content">
          <p>Eyecare Glasses - Kính xinh cho Gen Z.</p>
          <p>{isAuthenticated ? `Xin chào ${user?.name || user?.email}` : 'Mua ngay, giao nhanh 2h nội thành.'}</p>
        </div>
      </footer>
    </div>
  );
}

export default AppShell;
