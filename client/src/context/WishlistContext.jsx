import { createContext, useContext, useState, useCallback } from 'react';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const stored = localStorage.getItem('shopez_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const persist = (items) => {
    localStorage.setItem('shopez_wishlist', JSON.stringify(items));
  };

  const addToWishlist = useCallback((product) => {
    setWishlistItems((prev) => {
      if (prev.some((item) => item._id === product._id)) return prev;
      const next = [...prev, product];
      persist(next);
      return next;
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems((prev) => {
      const next = prev.filter((item) => item._id !== productId);
      persist(next);
      return next;
    });
  }, []);

  const toggleWishlist = useCallback((product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      const next = exists
        ? prev.filter((item) => item._id !== product._id)
        : [...prev, product];
      persist(next);
      return next;
    });
  }, []);

  const isInWishlist = useCallback(
    (productId) => wishlistItems.some((item) => item._id === productId),
    [wishlistItems]
  );

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
