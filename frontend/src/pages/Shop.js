import React from 'react';
import CatalogPage from './CatalogPage';

function Shop() {
  return (
    <CatalogPage
      defaultCategory="all"
      title="Tất cả sản phẩm"
      bannerImage="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1800&q=80"
    />
  );
}

export default Shop;
