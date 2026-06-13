import API from './api';

export const getDashboardStats = () => API.get('/admin/dashboard');
export const getAllUsers = () => API.get('/admin/users');
export const getAllOrders = () => API.get('/admin/orders');
export const getAllOrdersAdmin = () => API.get('/admin/orders');
