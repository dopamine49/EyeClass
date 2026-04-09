import React, { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import ProductCard from '../components/ProductCard';
import ReviewReel from '../components/ReviewReel';
import { useCatalogData } from '../hooks/useCatalogData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { priceToVnd } from '../utils/productMapper';
import { tiktokReviewReels } from '../data/mockProducts';

function ProductDetail() {
  const { id } = useParams();
  const { products, loading } = useCatalogData();
  const { upsertItem } = useCart();
  const { toggleWishlist, isWished } = useWishlist();

  const product = useMemo(() => products.find((item) => String(item.id) === String(id)), [products, id]);
  const related = useMemo(() => {
    if (!product) {
      return [];
    }
    return products
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  if (loading) {
    return <AppShell><p className="feedback-text">Đang tải chi tiết sản phẩm...</p></AppShell>;
  }

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  const addToCart = async () => {
    await upsertItem(product, quantity);
    setMessage('Đã thêm vào giỏ. Bạn có thể thanh toán ngay.');
  };

  return (
    <AppShell>
      <section className="product-detail">
        <div className="product-gallery">
          <img src={product.gallery[selectedImage]} alt={product.name} className="detail-main-image" loading="lazy" />
          <div className="thumb-row">
            {product.gallery.map((image, index) => (
              <button
                type="button"
                key={image}
                className={`thumb-btn ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info-panel">
          <p className="meta-line">{product.style} · {product.type}</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="price-line detail-price">
            <strong>{priceToVnd(product.price)}d</strong>
            <span>{priceToVnd(product.oldPrice)}d</span>
          </div>
          <p className="stock-fomo">Only {product.stock} left - mua sớm kẻo sold out</p>

          <div className="trust-badges">
            <span>Đổi trả 7 ngày</span>
            <span>Giao nhanh 2h</span>
            <span>Bảo hành 12 tháng</span>
          </div>

          <label className="qty-field">
            Số lượng
            <input
              type="number"
              min="1"
              max={product.stock}
              className="input"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
            />
          </label>

          <div className="detail-actions">
            <button type="button" className="btn btn-primary" onClick={addToCart}>
              Thêm vào giỏ
            </button>
            <Link to={`/try-on/${product.id}`} className="btn btn-ghost">Virtual Try-On</Link>
            <button type="button" className={`btn btn-lite ${isWished(product.id) ? 'active' : ''}`} onClick={() => toggleWishlist(product)}>
              {isWished(product.id) ? 'Đã lưu' : 'Lưu wishlist'}
            </button>
          </div>
          {message ? <p className="feedback-text">{message}</p> : null}
        </div>
      </section>

      <section className="sticky-mobile-cta">
        <strong>{priceToVnd(product.price)}d</strong>
        <button type="button" className="btn btn-primary" onClick={addToCart}>Thêm vào giỏ</button>
      </section>

      <ReviewReel reels={tiktokReviewReels} />

      <section className="section-block-v2">
        <div className="section-heading">
          <h2>Related products</h2>
          <Link to="/shop">View more</Link>
        </div>
        <div className="product-grid-v2">
          {related.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={(p) => upsertItem(p, 1)}
              onToggleWishlist={toggleWishlist}
              isWished={isWished(item.id)}
            />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export default ProductDetail;
