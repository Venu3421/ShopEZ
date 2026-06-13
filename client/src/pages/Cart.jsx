import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import SkeletonLoader from '../components/common/SkeletonLoader';

export default function Cart() {
  const { cartItems, cartTotal, loading, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl max-w-container-max mx-auto px-6 md:px-margin-desktop">
        <div className="space-y-6">
          <SkeletonLoader variant="text" className="w-48 h-8 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonLoader key={i} variant="rectangle" className="w-full h-32 rounded-3xl" />
              ))}
            </div>
            <div className="lg:col-span-1">
              <SkeletonLoader variant="rectangle" className="w-full h-72 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background text-on-surface">
        <EmptyState
          icon={<span className="material-symbols-outlined text-5xl">shopping_cart</span>}
          title="Your cart is empty"
          message="Explore our premium collection and find your style today."
          actionText="Continue Shopping"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-on-surface pt-32 pb-stack-xl max-w-container-max mx-auto px-6 md:px-margin-desktop">
      <div className="border-b border-outline-variant/20 pb-4 mb-8">
        <h1 className="font-headline-sm sm:font-headline-md font-bold text-on-surface">Shopping Bag</h1>
        <p className="text-xs text-on-surface-variant mt-1">You have {totalItemsCount} items in your bag</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const hasDiscount = item.discount && item.discount > 0;
            const singlePrice = item.price || 0;
            const discountedSinglePrice = hasDiscount
              ? singlePrice - (singlePrice * item.discount) / 100
              : singlePrice;
            const totalPrice = discountedSinglePrice * item.quantity;
            const originalTotalPrice = singlePrice * item.quantity;

            const prodId = item.productId?._id || item.productId || item.product?._id || item.product;
            const productLink = prodId ? `/products/${prodId}` : '/products';

            return (
              <div
                key={item._id}
                className="bg-white border border-outline-variant/30 rounded-3xl p-4 sm:p-5 flex gap-4 sm:gap-6 items-center shadow-sm relative group transition-all duration-300 hover:shadow-md"
              >
                <Link
                  to={productLink}
                  className="w-24 h-24 sm:w-28 sm:h-28 bg-surface-container-low rounded-2xl overflow-hidden flex-shrink-0 border border-outline-variant/20 block"
                >
                  <img
                    src={item.mainImg || '/placeholder.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="flex-1 min-w-0 pr-8">
                  <Link
                    to={productLink}
                    className="block text-base sm:text-lg font-bold text-on-surface hover:text-primary transition-colors truncate"
                  >
                    {item.title}
                  </Link>
                  {item.size && (
                    <span className="inline-block px-2.5 py-0.5 bg-surface-container text-on-surface-variant font-bold text-[10px] rounded-lg mt-1 uppercase tracking-wider">
                      Size: {item.size}
                    </span>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-primary text-base sm:text-lg">
                        ${totalPrice.toFixed(2)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-on-surface-variant/50 line-through">
                          ${originalTotalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="inline-flex items-center bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30 scale-90 sm:scale-100 origin-left">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-surface-container transition-colors disabled:opacity-50"
                        aria-label="Decrease quantity"
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <span className="w-8 text-center font-bold text-xs sm:text-sm text-on-surface">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-2 hover:bg-surface-container transition-colors"
                        aria-label="Increase quantity"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="absolute top-4 right-4 text-on-surface-variant/40 hover:text-error hover:bg-error/5 p-2 rounded-xl transition-all"
                  aria-label="Remove item"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm sticky top-32 space-y-6">
            <h2 className="font-headline-sm text-lg font-bold text-on-surface border-b border-outline-variant/20 pb-4">
              Order Summary
            </h2>

            <div className="space-y-3.5 text-sm text-on-surface-variant font-medium">
              <div className="flex justify-between">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="font-bold text-on-surface">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-500 font-bold uppercase text-[11px] tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                  Free
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="text-on-surface font-semibold">$0.00</span>
              </div>
            </div>

            <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-baseline">
              <span className="text-base font-bold text-on-surface">Order Total</span>
              <span className="text-2xl font-black text-primary">${cartTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group text-base"
            >
              Proceed to Checkout <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>

            <div className="text-center pt-2">
              <Link to="/products" className="text-xs text-primary font-bold hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
