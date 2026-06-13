import API from './api';

export const getAllOrders = (params) => API.get('/orders', { params });
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const createOrder = (data) => API.post('/orders', data);
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}`, data);
export const deleteOrder = (id) => API.delete(`/orders/${id}`);
