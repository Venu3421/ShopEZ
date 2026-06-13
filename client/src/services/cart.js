import API from './api';

export const getCartByUser = (userId) => API.get(`/cart/${userId}`);
export const addToCart = (data) => API.post('/cart', data);
export const updateCartItem = (id, data) => API.put(`/cart/${id}`, data);
export const removeFromCart = (id) => API.delete(`/cart/${id}`);
