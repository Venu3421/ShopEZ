import API from './api';

export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (userData) => API.post('/auth/register', userData);
export const logoutUser = () => API.post('/auth/logout');

export const login = loginUser;
export const register = registerUser;
export const logout = logoutUser;
