import React, { useMemo, useState } from 'react';
import AppShell from '../components/AppShell';
import ProductCard from '../components/ProductCard';
import { useCatalogData } from '../hooks/useCatalogData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const sortOptions = {
  popular: (a, b) => b.sold - a.sold,
  newest: (a, b) => Number(b.id) - Number(a.id),
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
};

function CatalogPage({ defaultCategory = 'all', title = 'Shop kính', bannerImage }) {
  const { products, loading } = useCatalogData();
  const { upsertItem } = useCart();
  const { toggleWishlist, isWished } = useWishlist();

  const [keyword, setKeyword] = useState('');
  const [style, setStyle] = useState('all');
  const [type, setType] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [message, setMessage] = useState('');

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Number.MAX_SAFE_INTEGER;

    return products
      .filter((item) => defaultCategory === 'all' || item.category === defaultCategory)
      .filter((item) => style === 'all' || item.style.toLowerCase() === style)
      .filter((item) => type === 'all' || item.type === type)
      .filter((item) => item.price >= min && item.price <= max)
      .filter((item) => {
        if (!keyword.trim()) {
          return true;
        }
        const q = keyword.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      })
      .sort(sortOptions[sortBy]);
  }, [products, defaultCategory, style, type, minPrice, maxPrice, keyword, sortBy]);

  const handleAdd = async (product) => {
    await upsertItem(product, 1);
    setMessage(`Đã thêm ${product.name} vào giỏ`);
  };

  return (
    <AppShell>
      <section className="listing-banner">
        <img
          src={bannerImage || 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1800&q=80'}
          alt={title}
          loading="lazy"
        />
        <div className="listing-banner-overlay" />
        <div className="listing-banner-content">
          <h1>{title}</h1>
          <p>Filter nhanh, mua nhanh, style đúng trend.</p>
        </div>
      </section>

      <section className="filter-panel">
        <input
          className="input"
          placeholder="Tìm theo tên kính..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select className="input" value={style} onChange={(e) => setStyle(e.target.value)}>
          <option value="all">Style</option>
          <option value="y2k">Y2K</option>
          <option value="retro">Retro</option>
          <option value="minimal">Minimal</option>
        </select>
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">Type</option>
          <option value="fashion">Fashion</option>
          <option value="blue-light">Blue Light</option>
          <option value="sunglasses">Sunglasses</option>
        </select>
        <input
          className="input"
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          className="input"
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="popular">Popular</option>
          <option value="newest">Newest</option>
          <option value="priceAsc">Price low-high</option>
          <option value="priceDesc">Price high-low</option>
        </select>
      </section>

      {message ? <p className="feedback-text">{message}</p> : null}
      {loading ? <p className="feedback-text">Đang tải sản phẩm...</p> : null}

      <section className="product-grid-v2">
        {filtered.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            onAddToCart={handleAdd}
            onToggleWishlist={toggleWishlist}
            isWished={isWished(item.id)}
          />
        ))}
      </section>
    </AppShell>
  );
}

export default CatalogPage;
