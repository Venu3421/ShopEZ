import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product, 'M', 1);
  };

  return (
    <main className="min-h-screen bg-background text-on-surface pt-24 pb-8 max-w-container-max mx-auto px-6 md:px-margin-desktop">
      <div className="mb-4">
        <h1 className="font-headline-sm sm:font-headline-md font-bold text-on-surface">My Wishlist</h1>
        <p className="text-on-surface-variant text-[11px] mt-0.5">
          {wishlistItems.length === 0
            ? 'Your wishlist is empty'
            : `${wishlistItems.length} item${wishlistItems.length > 1 ? 's' : ''} saved`}
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-outline-variant/30 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-primary">favorite</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-1">No Items in Wishlist</h3>
          <p className="text-on-surface-variant text-xs mb-5 max-w-md mx-auto">
            Browse our collection and tap the heart icon on products you love to save them here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:brightness-110 shadow-md transition-all active:scale-95 text-[11px]"
          >
            <span className="material-symbols-outlined text-[15px]">shopping_bag</span>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {wishlistItems.map((product) => {
            const hasDiscount = product.discount && product.discount > 0;
            const discountedPrice = hasDiscount
              ? (product.price - (product.price * product.discount) / 100).toFixed(2)
              : null;

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden border border-outline-variant/40 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                <Link to={`/products/${product._id}`} className="block">
                  <div className="aspect-square relative overflow-hidden bg-surface-container-low">
                    <img
                      src={product.mainImg || '/placeholder.jpg'}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {hasDiscount && (
                      <span className="absolute top-2 left-2 bg-secondary text-white px-1.5 py-0.5 rounded-full font-label-caps text-[8px] shadow-sm">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-2.5 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-[8px] font-bold text-on-surface-variant mb-0.5 uppercase tracking-wider">
                      {product.category}
                    </p>
                    <Link to={`/products/${product._id}`}>
                      <h3 className="font-bold text-xs text-on-surface hover:text-primary transition-colors truncate">
                        {product.title}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-1 mb-1.5">
                      {hasDiscount ? (
                        <div className="flex flex-col">
                          <span className="text-on-surface-variant text-[9px] line-through">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="font-bold text-xs text-primary">
                            ${discountedPrice}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-xs text-primary">
                          ${product.price?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 mt-auto">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 py-1.5 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-md hover:brightness-110 transition-all active:scale-95 text-[11px] flex items-center justify-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-[13px]">shopping_cart</span>
                      Add
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="px-1.5 py-1.5 border border-error/30 text-error rounded-md hover:bg-error/5 transition-all active:scale-95 flex items-center justify-center"
                      aria-label="Remove from wishlist"
                    >
                      <span className="material-symbols-outlined text-[13px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Wishlist;
