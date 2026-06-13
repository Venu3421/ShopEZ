import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (user && user._id) {
      try {
        const stored = localStorage.getItem(`shopez_wishlist_${user._id}`);
        setWishlistItems(stored ? JSON.parse(stored) : []);
      } catch {
        setWishlistItems([]);
      }
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const persist = useCallback((items) => {
    if (user && user._id) {
      localStorage.setItem(`shopez_wishlist_${user._id}`, JSON.stringify(items));
    }
  }, [user]);

  const addToWishlist = useCallback((product) => {
    if (!user || !user._id) return;
    setWishlistItems((prev) => {
      if (prev.some((item) => item._id === product._id)) return prev;
      const next = [...prev, product];
      persist(next);
      return next;
    });
  }, [user, persist]);

  const removeFromWishlist = useCallback((productId) => {
    if (!user || !user._id) return;
    setWishlistItems((prev) => {
      const next = prev.filter((item) => item._id !== productId);
      persist(next);
      return next;
    });
  }, [user, persist]);

  const toggleWishlist = useCallback((product) => {
    if (!user || !user._id) return;
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      const next = exists
        ? prev.filter((item) => item._id !== product._id)
        : [...prev, product];
      persist(next);
      return next;
    });
  }, [user, persist]);

  const isInWishlist = useCallback(
    (productId) => {
      if (!user || !user._id) return false;
      return wishlistItems.some((item) => item._id === productId);
    },
    [wishlistItems, user]
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
