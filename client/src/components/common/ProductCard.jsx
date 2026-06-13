import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [heartAnimating, setHeartAnimating] = useState(false);

  const {
    _id,
    title,
    mainImg,
    category,
    price,
    discount,
  } = product;

  const hasDiscount = discount && discount > 0;
  const discountedPrice = hasDiscount
    ? (price - (price * discount) / 100).toFixed(2)
    : null;

  const wishlisted = isInWishlist(_id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 'M', 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 300);
  };

  return (
    <div className="group product-card-lift bg-white rounded-2xl overflow-hidden border border-outline-variant/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
      <Link to={`/products/${_id}`} className="block">
        <div className="aspect-[4/5] relative overflow-hidden bg-surface-container-low">
          <img
            src={mainImg || '/placeholder.jpg'}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="action-overlay absolute inset-0 bg-black/10 backdrop-blur-[2px] opacity-0 flex flex-col items-center justify-center gap-3 transition-all duration-300 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
            <button className="w-40 bg-white text-on-surface font-medium py-2 rounded-lg shadow-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">visibility</span>
              Quick View
            </button>
            <button
              onClick={handleAddToCart}
              className="w-40 bg-primary text-white font-medium py-2 rounded-lg shadow-lg hover:bg-secondary transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              Add to Cart
            </button>
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all hover:scale-110 z-10 ${heartAnimating ? 'heart-pop' : ''}`}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <span
              className={`material-symbols-outlined text-[20px] transition-colors ${wishlisted ? 'text-error' : 'text-on-surface-variant'}`}
              style={{ fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>

          {hasDiscount ? (
            <span className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full font-label-caps text-[10px] shadow-sm">
              -{discount}%
            </span>
          ) : (
            <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full font-label-caps text-[10px] shadow-sm">
              NEW
            </span>
          )}
        </div>
        <div className="p-5">
          <p className="text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider font-semibold">{category}</p>
          <h3 className="font-headline-sm text-[18px] text-on-surface group-hover:text-primary transition-colors truncate">
            {title}
          </h3>
          <div className="flex items-center justify-between mt-3">
            {hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-on-surface-variant text-[12px] line-through">${price.toFixed(2)}</span>
                <span className="font-bold text-headline-sm text-primary">${discountedPrice}</span>
              </div>
            ) : (
              <span className="font-bold text-headline-sm text-primary">${price?.toFixed(2)}</span>
            )}
            <div className="flex items-center gap-1 text-tertiary">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-label-caps text-on-surface">4.9</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
