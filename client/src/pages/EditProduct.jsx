import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import * as productsService from '../services/products';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mainImg: '',
    carousel: '',
    category: 'Shirts',
    gender: 'men',
    price: '',
    discount: '0',
    rating: '4.5',
    sizes: { XS: false, S: false, M: false, L: false, XL: false, XXL: false },
  });

  const categories = ['Shirts', 'Pants', 'Shoes', 'Accessories', 'Jackets', 'Dresses'];
  const genders = ['men', 'women', 'kids', 'unisex'];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productsService.getProductById(id);
        
        // Map sizes array to object state
        const sizeMap = { XS: false, S: false, M: false, L: false, XL: false, XXL: false };
        if (data.sizes && Array.isArray(data.sizes)) {
          data.sizes.forEach((s) => {
            if (sizeMap[s] !== undefined) {
              sizeMap[s] = true;
            }
          });
        }

        setFormData({
          title: data.title || '',
          description: data.description || '',
          mainImg: data.mainImg || '',
          carousel: data.carousel ? data.carousel.join(', ') : '',
          category: data.category || 'Shirts',
          gender: data.gender || 'men',
          price: data.price ? data.price.toString() : '',
          discount: data.discount ? data.discount.toString() : '0',
          rating: data.rating ? data.rating.toString() : '4.5',
          sizes: sizeMap,
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch product details.');
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        sizes: { ...prev.sizes, [name]: checked },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const selectedSizes = Object.keys(formData.sizes).filter((size) => formData.sizes[size]);

      const payload = {
        title: formData.title,
        description: formData.description,
        mainImg: formData.mainImg,
        carousel: formData.carousel ? formData.carousel.split(',').map((u) => u.trim()) : [],
        category: formData.category,
        gender: formData.gender,
        price: Number(formData.price),
        discount: Number(formData.discount),
        rating: Number(formData.rating),
        sizes: selectedSizes,
      };

      await productsService.updateProduct(id, payload);
      alert('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      setError('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background text-on-surface">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
        <p className="text-sm font-semibold mt-4 text-on-surface-variant">Loading product details...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl max-w-container-max mx-auto px-6 md:px-margin-desktop">
      {/* Back button */}
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 font-semibold text-sm w-fit"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Products
      </Link>

      <div className="border-b border-outline-variant/20 pb-4 mb-8">
        <h1 className="font-headline-sm sm:font-headline-md font-bold text-on-surface">Edit Product</h1>
        <p className="text-xs text-on-surface-variant mt-1">Modify properties and settings for this inventory item</p>
      </div>

      <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 sm:p-8 shadow-sm">
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-lg flex-shrink-0">info</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Premium Cotton Knit Shirt"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/50 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="99.99"
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/50 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="10"
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/50 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="4.5"
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/50 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface outline-none focus:border-primary cursor-pointer text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface outline-none focus:border-primary cursor-pointer capitalize text-sm"
                  >
                    {genders.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Main Image URL *
                </label>
                <input
                  type="url"
                  name="mainImg"
                  required
                  value={formData.mainImg}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/50 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Carousel Images (comma-separated URLs)
                </label>
                <textarea
                  name="carousel"
                  rows="2"
                  value={formData.carousel}
                  onChange={handleChange}
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/50 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {Object.keys(formData.sizes).map((size) => (
                    <label
                      key={size}
                      className={`flex items-center gap-2 cursor-pointer bg-surface-container-low px-3.5 py-2 rounded-xl border transition-all ${
                        formData.sizes[size]
                          ? 'border-primary bg-primary/5 text-primary font-bold'
                          : 'border-outline-variant/30 hover:border-primary/30 text-on-surface-variant'
                      }`}
                    >
                      <input
                        type="checkbox"
                        name={size}
                        checked={formData.sizes[size]}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary rounded focus:ring-primary/10"
                      />
                      <span className="text-xs">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write detailed product information, materials, styling tips..."
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/50 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
            ></textarea>
          </div>

          <div className="pt-6 border-t border-outline-variant/20 flex justify-end gap-3">
            <Link
              to="/admin/products"
              className="px-6 py-3 border border-outline-variant/30 text-on-surface rounded-xl hover:bg-surface-container transition-all font-bold text-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm flex items-center gap-2 disabled:opacity-70 disabled:scale-100"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
