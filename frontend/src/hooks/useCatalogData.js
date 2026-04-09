import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { mockProducts } from '../data/mockProducts';
import { toProductCatalog } from '../utils/productMapper';

export function useCatalogData() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      setLoading(true);
      try {
        const response = await api.getProducts({ page: 0, size: 60, sortBy: 'createdAt', sortDir: 'desc' });
        const content = response?.data?.content || [];
        if (mounted) {
          setProducts(toProductCatalog(content));
        }
      } catch (error) {
        if (mounted) {
          setProducts(toProductCatalog(mockProducts));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return { products, loading };
}
