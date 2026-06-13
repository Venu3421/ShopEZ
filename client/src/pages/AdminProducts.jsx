import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as productsService from '../services/products';
import SkeletonLoader from '../components/common/SkeletonLoader';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await productsService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsService.deleteProduct(id);
        setProducts(products.filter((p) => p._id !== id));
      } catch (error) {
        console.error('Failed to delete product', error);
        alert('Error deleting product');
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl max-w-container-max mx-auto px-6 md:px-margin-desktop">
      {/* Back button */}
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 font-semibold text-sm w-fit"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Dashboard
      </Link>

      {/* Header */}
      <header className="flex justify-between items-center mb-stack-xl">
        <div>
          <h2 className="font-headline-sm text-headline-sm tracking-tight text-on-surface">Inventory Management</h2>
          <p className="text-on-surface-variant font-body-md text-body-md opacity-80">Oversee your catalog and product listings.</p>
        </div>
        <Link
          to="/admin/add-product"
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full font-label-caps text-label-caps uppercase tracking-widest shadow-lg hover:brightness-110 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          Add New Product
        </Link>
      </header>

      {/* Search & Stats */}
      <div className="flex items-center justify-between mb-stack-md">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            className="bg-surface-container-low border border-outline-variant/30 rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="Search inventory..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-surface-container-low border border-outline-variant/30 p-2 rounded-xl hover:bg-surface-container-high transition-all">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white border border-outline-variant/30 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <SkeletonLoader key={i} variant="rectangle" className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/10 border-b border-outline-variant/10">
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Product</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Category</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-right">Price</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Discount</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Pieces</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-surface-container-highest/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container-highest">
                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={product.mainImg || '/placeholder.jpg'} alt={product.title} />
                      </div>
                      <div>
                        <p className="font-body-md text-body-md font-semibold">{product.title}</p>
                        <p className="text-xs text-on-surface-variant">ID: PROD-{product._id.substring(product._id.length - 6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant capitalize">{product.category} {product.gender && `(${product.gender})`}</td>
                  <td className="px-6 py-4 text-right font-body-md font-bold text-primary">₹{product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    {product.discount > 0 ? (
                      <span className="bg-primary-container/10 text-primary px-3 py-1 rounded-full text-[11px] font-bold">{product.discount}% OFF</span>
                    ) : (
                      <span className="text-on-surface-variant/40 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      product.stock <= 5 
                        ? 'bg-error/10 text-error' 
                        : 'bg-emerald-500/10 text-emerald-600'
                    }`}>
                      {product.stock !== undefined ? product.stock : 10} pcs
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/edit-product/${product._id}`}
                        className="p-2 hover:bg-secondary/10 text-secondary rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-on-surface-variant/60 font-semibold">No products match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <div className="p-4 border-t border-outline-variant/10 flex items-center justify-between text-sm text-on-surface-variant">
          <span>Showing {filteredProducts.length > 0 ? `1-${Math.min(filteredProducts.length, 10)}` : '0'} of {products.length} products</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-surface-container-highest/10 hover:bg-surface-container-highest/20 transition-all">Previous</button>
            <button className="px-4 py-2 rounded-lg bg-surface-container-highest/20 hover:bg-surface-container-highest/30 transition-all text-on-surface">Next</button>
          </div>
        </div>
      </div>
    </main>
  );
}
