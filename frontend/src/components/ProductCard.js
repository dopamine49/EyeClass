import React from 'react';
import { Link } from 'react-router-dom';
import { discountPercent, priceToVnd } from '../utils/productMapper';

function ProductCard({ product, onAddToCart, onToggleWishlist, isWished }) {
  const discount = discountPercent(product.price, product.oldPrice);

  return (
    <article className="product-card-v2">
      <Link to={`/products/${product.id}`} className="product-thumb">
        <img src={product.imageUrl} alt={product.name} loading="lazy" className="primary-image" />
        <img src={product.imageAlt || product.imageUrl} alt={`${product.name} alternate`} loading="lazy" className="secondary-image" />
        {discount > 0 ? <span className="badge-discount">-{discount}%</span> : null}
        {product.isTrending ? <span className="badge-trending">Trending</span> : null}
      </Link>

      <div className="product-meta">
        <p className="meta-line">{product.style} · {product.type}</p>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="price-line">
          <strong>{priceToVnd(product.price)}d</strong>
          {product.oldPrice ? <span>{priceToVnd(product.oldPrice)}d</span> : null}
        </div>
        <p className="stock-fomo">Only {product.stock} left</p>
      </div>

      <div className="card-actions">
        <button type="button" className="btn btn-primary" onClick={() => onAddToCart(product)}>
          Thêm nhanh
        </button>
        <Link to={`/try-on/${product.id}`} className="btn btn-ghost">
          Thử kính
        </Link>
        <button type="button" className={`btn btn-lite ${isWished ? 'active' : ''}`} onClick={() => onToggleWishlist(product)}>
          {isWished ? 'Đã lưu' : 'Lưu'}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
