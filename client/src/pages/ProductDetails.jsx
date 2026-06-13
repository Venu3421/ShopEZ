import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProductById, getAllProducts } from '../services/products';
import ProductCard from '../components/common/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();
  const { removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getProductById(id);
        setProduct(data);
        setMainImage(data.mainImg || '');
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.category) {
          const { data: allProds } = await getAllProducts({ category: data.category });
          setRelated(allProds.filter((p) => p._id !== data._id).slice(0, 4));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
        if (isInWishlist(id)) {
          removeFromWishlist(id);
        }
      }
      setLoading(false);
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedSize && product.sizes?.length) return;
    setAdding(true);
    try {
      await addToCart(product, selectedSize, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch {
      // error handled
    }
    setAdding(false);
  };

  const hasDiscount = product?.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : null;

  const allImages = product ? [product.mainImg, ...(product.carousel || [])].filter(Boolean) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl max-w-container-max mx-auto px-6 md:px-margin-desktop">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-48 bg-surface-container-high rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-7">
              <div className="aspect-square bg-surface-container-high rounded-3xl mb-4" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 bg-surface-container-high rounded-xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="h-10 bg-surface-container-high rounded-xl w-3/4" />
              <div className="h-6 bg-surface-container-high rounded-xl w-1/4" />
              <div className="h-4 bg-surface-container-high rounded-xl w-full" />
              <div className="h-16 bg-surface-container-high rounded-xl w-full mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background text-on-surface">
        <div className="text-center max-w-md p-6 bg-white border border-outline-variant/30 rounded-3xl shadow-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-error">package_2</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-3">Product Not Found</h2>
          <p className="text-on-surface-variant text-body-md mb-6">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:brightness-110 shadow-md transition-all active:scale-95 text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl max-w-container-max mx-auto px-6 md:px-margin-desktop">
      {/* Breadcrumbs */}
      <nav className="mb-stack-lg flex items-center gap-2 text-label-caps font-label-caps text-on-surface-variant">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface capitalize">{product?.category}</span>
      </nav>

      {/* Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Gallery - 7 cols */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-4 overflow-x-auto no-scrollbar md:w-24 shrink-0">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 md:w-full aspect-square rounded-xl border-2 overflow-hidden transition-all bg-surface ${
                  mainImage === img ? 'border-primary' : 'border-transparent hover:border-outline-variant'
                }`}
              >
                <img className="w-full h-full object-cover" src={img} alt="" />
              </button>
            ))}
          </div>
          <div className="flex-1 bg-surface-container rounded-2xl overflow-hidden relative group aspect-[4/5] max-h-[500px] md:max-h-[550px]">
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={mainImage}
              alt={product?.title}
            />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button className="bg-surface/80 backdrop-blur-md p-3 rounded-full shadow-lg text-on-surface hover:text-primary transition-colors">
                <span className="material-symbols-outlined">zoom_in</span>
              </button>
              <button className="bg-surface/80 backdrop-blur-md p-3 rounded-full shadow-lg text-on-surface hover:text-error transition-colors">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
          </div>
        </div>

        {/* Details - 5 cols */}
        <div className="lg:col-span-5 sticky top-32">
          <div className="flex flex-col gap-6">
            <div>
              <span className="font-label-caps text-label-caps text-primary bg-primary/10 px-3 py-1 rounded-full">New Arrival</span>
              <h1 className="font-display-lg text-display-lg-mobile md:text-headline-md text-on-surface mt-2">{product?.title}</h1>
              <p className="font-body-md text-on-surface-variant mt-1">by <span className="font-bold text-on-surface">ShopEZ Premium</span></p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex text-tertiary">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="material-symbols-outlined" style={{ fontVariationSettings: star <= 4 ? "'FILL' 1" : "'FILL' 0" }}>
                    {star <= 4 ? 'star' : 'star_half'}
                  </span>
                ))}
              </div>
              <span className="font-body-md text-on-surface-variant">4.8 (124 reviews)</span>
            </div>

            <div className="flex items-baseline gap-4 border-b border-outline-variant pb-6">
              <span className="font-headline-md text-headline-md text-on-surface">
                ${hasDiscount ? discountedPrice : product?.price}
              </span>
              {hasDiscount && (
                <>
                  <span className="font-body-lg text-on-surface-variant line-through">${product?.price}</span>
                  <span className="font-label-caps text-label-caps text-error bg-error/10 px-2 py-1 rounded">Save {product?.discount}%</span>
                </>
              )}
            </div>

            {/* Color Selector */}
            <div className="flex flex-col gap-4">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Select Color</label>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-slate-900 border-2 border-primary ring-2 ring-background"></button>
                <button className="w-10 h-10 rounded-full bg-slate-400 border-2 border-transparent hover:border-outline"></button>
                <button className="w-10 h-10 rounded-full bg-stone-200 border-2 border-transparent hover:border-outline"></button>
              </div>
            </div>

            {/* Size Selector */}
            {product?.sizes?.length > 0 && (
              <div className="flex flex-col gap-4">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Select Size</label>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-12 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
                        selectedSize === size
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                          : 'bg-surface-container-low text-on-surface border border-outline-variant/30 hover:border-primary/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={adding || addedToCart}
                className={`w-full py-5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                  addedToCart
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gradient-to-r from-primary to-secondary text-white hover:brightness-110 active:scale-[0.98]'
                }`}
              >
                {adding ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : addedToCart ? (
                  <>
                    <span className="material-symbols-outlined">check</span> Added to Cart!
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">shopping_cart</span> Add to Cart
                  </>
                )}
              </button>
              <button className="w-full py-5 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 active:scale-[0.98] transition-all">
                Buy It Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-col gap-4 py-6 bg-surface-container-low rounded-2xl px-6 border border-outline-variant">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <div>
                  <p className="font-bold text-[14px]">Free Express Shipping</p>
                  <p className="text-[12px] text-on-surface-variant">Delivery within 2-3 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <div>
                  <p className="font-bold text-[14px]">Authorized Retailer</p>
                  <p className="text-[12px] text-on-surface-variant">100% Genuine ShopEZ Products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Tabs */}
      <section className="mt-10">
        <div className="border-b border-outline-variant flex gap-8">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-label-caps text-label-caps transition-all ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'border-b-2 border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab === 'reviews' ? 'Reviews (124)' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="py-6 min-h-[300px]">
          {activeTab === 'description' && (
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <h3 className="font-headline-sm text-headline-sm">Experience True Quality</h3>
                <p className="font-body-lg text-on-surface-variant">
                  {product?.description || 'No description available for this product.'}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span>Premium quality materials for lasting comfort</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span>Crafted with attention to every detail</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span>Designed for modern lifestyle and durability</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 rounded-3xl overflow-hidden bg-surface-container-high aspect-square">
                <img
                  className="w-full h-full object-cover"
                  alt="Product lifestyle"
                  src={product?.mainImg || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600'}
                />
              </div>
            </div>
          )}
          {activeTab === 'specifications' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Category', value: product?.category || 'General' },
                  { label: 'Suitable For', value: product?.gender ? `${product.gender}` : 'Unisex' },
                  { label: 'Available Sizes', value: product?.sizes?.join(', ') || 'One Size' },
                  { label: 'Material', value: 'Premium Organic Cotton & Eco Polyester Blend' },
                  { label: 'Care Instructions', value: 'Machine wash cold, tumble dry low' },
                  { label: 'Warranty', value: '1 Year Brand Warranty' },
                ].map((spec) => (
                  <div key={spec.label} className="flex justify-between py-4 border-b border-outline-variant">
                    <span className="text-on-surface-variant">{spec.label}</span>
                    <span className="font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-12 border-b border-outline-variant pb-8">
                <div className="text-center md:text-left">
                  <h4 className="font-display-lg text-display-lg text-primary">4.8</h4>
                  <div className="flex justify-center md:justify-start text-tertiary mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="material-symbols-outlined" style={{ fontVariationSettings: star <= 4 ? "'FILL' 1" : "'FILL' 0" }}>
                        {star <= 4 ? 'star' : 'star_half'}
                      </span>
                    ))}
                  </div>
                  <p className="text-on-surface-variant mt-2">Based on 124 reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[
                    { label: '5 Star', pct: 85 },
                    { label: '4 Star', pct: 10 },
                    { label: '3 Star', pct: 3 },
                    { label: '2 Star', pct: 1 },
                    { label: '1 Star', pct: 1 },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-4">
                      <span className="w-12 text-label-caps text-on-surface-variant">{row.label}</span>
                      <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${row.pct}%` }}></div>
                      </div>
                      <span className="w-12 text-label-caps text-on-surface-variant text-right">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold">JD</div>
                      <div>
                        <p className="font-bold">John Doe</p>
                        <p className="text-[12px] text-on-surface-variant">Verified Buyer &bull; 2 days ago</p>
                      </div>
                    </div>
                    <div className="flex text-tertiary">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-on-surface-variant">Incredible quality. Exceeded my expectations in every way.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Similar Products */}
      {related.length > 0 && (
        <section className="mt-10">
          <div className="flex justify-between items-end mb-stack-lg">
            <h2 className="font-headline-md text-headline-md">Similar Products</h2>
            <Link to="/products" className="text-primary font-bold flex items-center gap-1 hover:underline">
              View All <span className="material-symbols-outlined">arrow_right_alt</span>
            </Link>
          </div>
          <div className="flex gap-gutter overflow-x-auto no-scrollbar pb-8 -mx-4 px-4">
            {related.map((p) => (
              <div key={p._id} className="min-w-[280px] flex-shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetails;
