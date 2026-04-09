import React from 'react';
import { Link } from 'react-router-dom';

function HeroBanner() {
  return (
    <section className="hero-banner">
      <img
        src="https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1800&q=80"
        alt="Model wearing eyeglasses"
        loading="eager"
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="hero-tag">Spring Drop 2026</span>
        <h1>Mix đồ chất, lên hình đẹp, mua kính dễ hơn bao giờ hết</h1>
        <p>Kính trend cho sinh viên và Gen Z. Giá vừa túi tiền, style đa dạng, giao nhanh.</p>
        <div className="hero-actions">
          <Link to="/shop" className="btn btn-primary">Thử kính ngay</Link>
          <Link to="/shop" className="btn btn-ghost">Mua ngay</Link>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
