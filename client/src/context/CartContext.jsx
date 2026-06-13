import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as cartService from '../services/cart';

export const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from API when user logs in
  const fetchCart = useCallback(async () => {
    if (!user?._id) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await cartService.getCartByUser(user._id);
      setCartItems(data.items || data || []);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (product, size = 'M', quantity = 1) => {
      if (!user?._id) return;
      setLoading(true);
      try {
        await cartService.addToCart({
          userId: user._id,
          productId: product._id,
          title: product.title,
          description: product.description,
          mainImg: product.mainImg,
          size,
          quantity,
          price: product.price,
          discount: product.discount || 0,
        });

        // Reconcile with server
        await fetchCart();
      } catch (err) {
        await fetchCart();
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, fetchCart]
  );

  const removeFromCart = useCallback(
    async (itemId) => {
      setLoading(true);
      try {
        await cartService.removeFromCart(itemId);
        setCartItems((prev) => prev.filter((item) => item._id !== itemId));
      } catch {
        await fetchCart();
      } finally {
        setLoading(false);
      }
    },
    [fetchCart]
  );

  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      if (quantity < 1) {
        return removeFromCart(itemId);
      }

      setLoading(true);
      try {
        await cartService.updateCartItem(itemId, { quantity });
        setCartItems((prev) =>
          prev.map((item) =>
            item._id === itemId ? { ...item, quantity } : item
          )
        );
      } catch {
        await fetchCart();
      } finally {
        setLoading(false);
      }
    },
    [removeFromCart, fetchCart]
  );

  const clearCart = useCallback(async () => {
    setLoading(true);
    try {
      // Remove each item
      await Promise.all(
        cartItems.map((item) => cartService.removeFromCart(item._id))
      );
      setCartItems([]);
    } catch {
      await fetchCart();
    } finally {
      setLoading(false);
    }
  }, [cartItems, fetchCart]);

  // Derived values
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.price || 0;
    const discount = item.discount || 0;
    const discountedPrice = price - (price * discount) / 100;
    return sum + discountedPrice * (item.quantity || 0);
  }, 0);

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;

