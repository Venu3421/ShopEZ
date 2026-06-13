import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ProductContext } from '../context/ProductContext';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import SkeletonLoader from '../components/common/SkeletonLoader';

const Home = () => {
  const { user } = useContext(AuthContext);
  const { products, loading } = useContext(ProductContext);
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    if (user && user.userType === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (products.length > 0) {
      setFeaturedProducts(products.slice(0, 8));
    }
  }, [products]);

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary-fixed selection:text-primary transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" id="hero-slider">
          <div className="min-w-full relative h-full">
            <div className="absolute inset-0 bg-black/20 z-10"></div>
            <img
              className="absolute inset-0 w-full h-full object-cover"
              alt="ShopEZ Premium Collection 2026"
              src="/shopez-bg.png"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-margin-desktop max-w-container-max mx-auto text-white">
              <span className="font-label-caps text-label-caps uppercase tracking-widest mb-4 bg-primary/20 backdrop-blur-sm px-4 py-1 self-start rounded-full border border-white/20">
                New Collection 2026
              </span>
              <h1 className="font-display-lg text-display-lg mb-6 max-w-2xl">
                Redefine Your Living Space
              </h1>
              <p className="font-body-lg text-body-lg mb-10 max-w-lg opacity-90">
                Experience the intersection of architectural design and effortless comfort with our latest curated selection.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/products"
                  className="bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-xl font-headline-sm text-white hover:brightness-110 transition-all shadow-lg active:scale-95"
                >
                  Shop Now
                </Link>
                <Link
                  to="/products?sort=newest"
                  className="bg-white/10 backdrop-blur-md border border-white/30 px-8 py-4 rounded-xl font-headline-sm text-white hover:bg-white/20 transition-all active:scale-95"
                >
                  Explore Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Bento Grid */}
      <section className="py-stack-xl px-6 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-stack-lg">
          <div>
            <span className="text-primary font-label-caps text-label-caps uppercase tracking-widest">BROWSE COLLECTIONS</span>
            <h2 className="font-headline-md text-headline-md mt-2">Shop by Category</h2>
          </div>
          <Link to="/products" className="text-primary hover:underline font-label-caps text-label-caps flex items-center gap-1">
            VIEW ALL <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-[600px]">
          <Link to="/products?category=Electronics" className="md:col-span-7 relative rounded-3xl overflow-hidden group block">
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt="Electronics"
              src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=800"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
              <h3 className="font-headline-sm text-headline-sm">Electronics</h3>
              <p className="opacity-80">Next-gen tech for modern life</p>
            </div>
          </Link>
          <div className="md:col-span-5 grid grid-rows-2 gap-gutter">
            <Link to="/products?category=Apparel" className="relative rounded-3xl overflow-hidden group block">
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Fashion"
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="font-headline-sm text-headline-sm">Fashion</h3>
                <p className="opacity-80">Sustainable elegance</p>
              </div>
            </Link>
            <Link to="/products?category=Home%20Decor" className="relative rounded-3xl overflow-hidden group block">
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Home & Decor"
                src="/home-decor.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="font-headline-sm text-headline-sm">Home &amp; Decor</h3>
                <p className="opacity-80">Curated spaces</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-stack-xl px-6 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-stack-lg">
          <div>
            <span className="text-primary font-label-caps text-label-caps uppercase tracking-widest">PREMIUM PICKS</span>
            <h2 className="font-headline-md text-headline-md mt-2">Featured Products</h2>
          </div>
          <div className="flex gap-2">
            <Link to="/products" className="text-primary hover:underline font-label-caps text-label-caps flex items-center gap-1">
              VIEW ALL <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <SkeletonLoader variant="rectangle" className="h-64 rounded-3xl" />
                <SkeletonLoader variant="text" count={2} />
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-20 bg-surface-container rounded-3xl border border-outline-variant/30">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary">shopping_bag</span>
            </div>
            <h3 className="text-xl font-semibold text-on-surface mb-2">No Products Yet</h3>
            <p className="text-on-surface-variant text-sm">Check back soon for our latest collection!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-surface-container-low py-stack-xl">
        <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
          <div className="text-center mb-stack-lg">
            <span className="text-primary font-label-caps text-label-caps uppercase tracking-widest">TESTIMONIALS</span>
            <h2 className="font-headline-md text-headline-md mt-2">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              { quote: "The quality of the Chronos watch is beyond my expectations. The delivery was incredibly fast, and the packaging felt like a luxury event.", name: "Marcus Sterling", title: "Verified Buyer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" },
              { quote: "ShopEZ has become my go-to for home decor. Their curated selection perfectly matches my minimalist aesthetic. Highly recommended!", name: "Elena Vance", title: "Interior Designer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" },
              { quote: "Excellent customer service. I had a small issue with my order and they resolved it in less than an hour. That's real premium service.", name: "David Chen", title: "Verified Buyer", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120" },
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
                <div className="flex gap-1 text-amber-500 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="italic text-on-surface-variant mb-6">&ldquo;{review.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img className="w-full h-full object-cover" alt={review.name} src={review.img} />
                  </div>
                  <div>
                    <h4 className="font-bold">{review.name}</h4>
                    <span className="text-[12px] text-on-surface-variant">{review.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
