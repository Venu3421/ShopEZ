import { useContext, useState, useEffect, useCallback } from 'react';
import { ProductContext } from '../context/ProductContext';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import SkeletonLoader from '../components/common/SkeletonLoader';

const Products = () => {
  const { products, loading, fetchProducts } = useContext(ProductContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');

  // Sync state on searchParams change
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setGender(searchParams.get('gender') || '');
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  useEffect(() => {
    const filters = {};
    if (searchParams.get('gender')) filters.gender = searchParams.get('gender');
    if (searchParams.get('category')) filters.category = searchParams.get('category');
    if (searchParams.get('search')) filters.search = searchParams.get('search');
    fetchProducts(filters);
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    const params = {};
    if (val) params.search = val;
    if (gender) params.gender = gender;
    if (category) params.category = category;
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    setSearch('');
    setGender('');
    setCategory('');
    setRatingFilter(0);
    setPriceRange([0, 10000]);
    setSearchParams({});
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  let filteredProducts = products.filter((p) => {
    const discountedPrice = p.price - (p.price * (p.discount || 0)) / 100;
    const matchesPrice = discountedPrice >= priceRange[0] && discountedPrice <= priceRange[1];
    const matchesRating = !ratingFilter || (p.rating || 4.5) >= ratingFilter;
    return matchesPrice && matchesRating;
  });

  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => {
      const priceA = a.price - (a.price * (a.discount || 0)) / 100;
      const priceB = b.price - (b.price * (b.discount || 0)) / 100;
      return priceA - priceB;
    });
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => {
      const priceA = a.price - (a.price * (a.discount || 0)) / 100;
      const priceB = b.price - (b.price * (b.discount || 0)) / 100;
      return priceB - priceA;
    });
  } else if (sortBy === 'newest') {
    filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const genders = ['men', 'women', 'kids', 'unisex'];
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const getCategoryCount = (catName) => {
    return products.filter((p) => p.category === catName).length;
  };

  const FilterSidebar = ({ mobile = false }) => (
    <div className={`${mobile ? '' : 'sticky top-24'} space-y-6`}>
      <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <h3 className="text-body-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">filter_list</span> Filters
          </h3>
          <button onClick={clearFilters} className="text-xs text-primary hover:underline font-semibold">Clear All</button>
        </div>

        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">Search</label>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/50 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm"
              />
            </div>
          </form>
        </div>

        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">Gender</label>
          <div className="flex flex-wrap gap-2">
            {genders.map((g) => (
              <button
                key={g}
                onClick={() => {
                  const newGender = gender === g ? '' : g;
                  setGender(newGender);
                  const params = {};
                  if (search) params.search = search;
                  if (newGender) params.gender = newGender;
                  if (category) params.category = category;
                  setSearchParams(params);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                  gender === g
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {categories.length > 0 && (
          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">Categories</label>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li
                  key={c}
                  onClick={() => {
                    const newCat = category === c ? '' : c;
                    setCategory(newCat);
                    const params = {};
                    if (search) params.search = search;
                    if (gender) params.gender = gender;
                    if (newCat) params.category = newCat;
                    setSearchParams(params);
                  }}
                  className={`flex items-center justify-between group cursor-pointer py-1 transition-colors ${
                    category === c ? 'text-primary font-semibold' : 'text-on-surface hover:text-primary'
                  }`}
                >
                  <span className="text-sm capitalize">{c}</span>
                  <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">{getCategoryCount(c)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">Price Range</label>
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-1.5 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
            <div className="flex items-center justify-between text-body-md text-on-surface">
              <span>$0</span>
              <span className="font-bold text-primary">${priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">Ratings</label>
          <div className="space-y-2">
            {[4, 3, 2].map((stars) => (
              <button
                key={stars}
                type="button"
                onClick={() => setRatingFilter(ratingFilter === stars ? 0 : stars)}
                className={`flex items-center gap-1 text-tertiary hover:scale-105 transition-transform ${ratingFilter === stars ? 'font-bold scale-105' : 'opacity-70'}`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: i < stars ? "'FILL' 1" : "'FILL' 0" }}>
                    star
                  </span>
                ))}
                <span className={`text-[12px] font-semibold ml-1 ${ratingFilter === stars ? 'text-primary' : 'text-on-surface-variant'}`}>&amp; Up</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl max-w-container-max mx-auto px-6 md:px-margin-desktop">
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setShowFilters(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-outline-variant/30 rounded-xl text-on-surface font-semibold shadow-sm text-sm"
        >
          <span className="material-symbols-outlined text-primary">filter_list</span> Filters
        </button>
        <span className="text-on-surface-variant text-sm font-medium">{filteredProducts.length} items</span>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-background p-6 overflow-y-auto">
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowFilters(false)} className="p-2 rounded-xl bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <FilterSidebar mobile />
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-gutter">
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <FilterSidebar />
        </aside>

        <div className="flex-1 space-y-stack-md">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-4">
              <h1 className="font-headline-sm text-headline-sm text-on-surface">Premium Collection</h1>
              <span className="hidden sm:inline-block text-on-surface-variant text-body-md border-l border-outline-variant pl-4">
                Showing 1&ndash;{Math.min(filteredProducts.length, 12)} of {products.length} items
              </span>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-label-caps text-on-surface-variant" htmlFor="sort">Sort by:</label>
              <select
                className="bg-transparent border-none font-medium text-on-surface focus:ring-0 cursor-pointer"
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter animate-pulse">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <SkeletonLoader variant="rectangle" className="h-64 rounded-3xl" />
                  <SkeletonLoader variant="text" count={2} />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-outline-variant/30 shadow-sm">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-primary">search</span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-3">No Products Found</h3>
              <p className="text-on-surface-variant text-body-md mb-6 max-w-md mx-auto">
                We couldn&apos;t find any products matching your criteria. Try adjusting your filters or search term.
              </p>
              <button
                onClick={clearFilters}
                className="px-8 py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:brightness-110 shadow-md transition-all active:scale-95 text-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 12 && (
            <div className="mt-stack-xl flex items-center justify-center gap-stack-sm">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface hover:border-primary transition-all">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface hover:border-primary transition-all">3</button>
              <span className="px-2 text-on-surface-variant">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface hover:border-primary transition-all">
                {Math.ceil(filteredProducts.length / 12)}
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Products;
