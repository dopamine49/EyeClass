import React from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { priceToVnd } from '../utils/productMapper';

function Wishlist() {
  const { items, toggleWishlist, clearWishlist } = useWishlist();
  const { upsertItem } = useCart();

  return (
    <AppShell>
      <section className="section-block-v2">
        <div className="section-heading">
          <h1>Wishlist</h1>
          <button type="button" className="btn btn-lite" onClick={clearWishlist}>Clear all</button>
        </div>

        {items.length ? (
          <div className="saved-grid">
            {items.map((item) => (
              <article key={item.id} className="saved-card">
                <img src={item.imageUrl} alt={item.name} loading="lazy" />
                <h3>{item.name}</h3>
                <p>{priceToVnd(item.price)}d</p>
                <div className="card-actions">
                  <button type="button" className="btn btn-primary" onClick={() => upsertItem(item, 1)}>Add to cart</button>
                  <button type="button" className="btn btn-lite" onClick={() => toggleWishlist(item)}>Remove</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="feedback-text">Wishlist trống. <Link to="/shop">Khám phá sản phẩm</Link></p>
        )}
      </section>
    </AppShell>
  );
}

export default Wishlist;
