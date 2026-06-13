import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as productsService from '../services/products';

export const ProductContext = createContext(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

const CATEGORIES = [
  'Shirts',
  'Pants',
  'Shoes',
  'Accessories',
  'Jackets',
  'Dresses',
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sort: '',
    page: 1,
    limit: 12,
  });

  const fetchProducts = useCallback(async (overrideFilters) => {
    setLoading(true);
    setError(null);

    try {
      const appliedFilters = overrideFilters || filters;
      const { data } = await productsService.getAllProducts(appliedFilters);

      // API may return { products: [...] } or just [...]
      setProducts(data.products || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch products on mount and whenever filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const value = {
    products,
    categories: CATEGORIES,
    loading,
    error,
    filters,
    setFilters,
    fetchProducts,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductContext;
