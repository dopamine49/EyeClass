import React from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import FlashSaleTimer from '../components/FlashSaleTimer';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import ReviewReel from '../components/ReviewReel';
import { useCatalogData } from '../hooks/useCatalogData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { tiktokReviewReels } from '../data/mockProducts';

function Home() {
  const { products } = useCatalogData();
  const { upsertItem } = useCart();
  const { toggleWishlist, isWished } = useWishlist();

  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4);
  const newArrivals = [...products].filter((item) => item.isNew).slice(0, 4);
  const trending = [...products].filter((item) => item.isTrending).slice(0, 4);

  return (
    <AppShell>
      <HeroBanner />

      <section className="promo-grid">
        <article>
          <p>Ưu đãi sinh viên</p>
          <strong>Giảm 15% cho .edu + student card</strong>
          <Link to="/checkout">Xác thực ngay</Link>
        </article>
        <article>
          <p>Buy 1 Get 1</p>
          <strong>Mua 1 kính, thêm 1 phụ kiện 0đ</strong>
          <Link to="/shop">Săn deal ngay</Link>
        </article>
        <article>
          <FlashSaleTimer targetDate="2026-12-31T23:59:59+07:00" />
        </article>
      </section>

      <section className="section-block-v2">
        <div className="section-heading">
          <h2>Best sellers</h2>
          <Link to="/shop">Xem tat ca</Link>
        </div>
        <div className="product-grid-v2">
          {bestSellers.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={(product) => upsertItem(product, 1)}
              onToggleWishlist={toggleWishlist}
              isWished={isWished(item.id)}
            />
          ))}
        </div>
      </section>

      <section className="section-block-v2">
        <div className="section-heading">
          <h2>New arrivals</h2>
          <p>Drop mới cho mùa back-to-school và mùa du lịch hè.</p>
        </div>
        <div className="product-grid-v2">
          {newArrivals.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={(product) => upsertItem(product, 1)}
              onToggleWishlist={toggleWishlist}
              isWished={isWished(item.id)}
            />
          ))}
        </div>
      </section>

      <section className="section-block-v2">
        <div className="section-heading">
          <h2>Trending now</h2>
          <p>Cảm hứng từ feed TikTok, dễ mix với outfit street và clean fit.</p>
        </div>
        <div className="product-grid-v2">
          {trending.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={(product) => upsertItem(product, 1)}
              onToggleWishlist={toggleWishlist}
              isWished={isWished(item.id)}
            />
          ))}
        </div>
      </section>

      <ReviewReel reels={tiktokReviewReels} />
    </AppShell>
  );
}

export default Home;
