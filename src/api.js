import axios from 'axios';

export const API_BASE_URL = 'http://localhost:4444';


export const  getProducts = () => {
  return axios.get(`${API_BASE_URL}/products`);
};


export const getUsers = () => {
  return axios.get(`${API_BASE_URL}/users`);
};

export const getUserById = (userId) => {
  return axios.get(`${API_BASE_URL}/users/${userId}`);
};

export const createUser = (userData) => {
  return axios.post(`${API_BASE_URL}/users`, userData);
};

export const updateUser = (userId, userData) => {
  return axios.put(`${API_BASE_URL}/users/${userId}`, userData);
};

export const deleteUser = (userId) => {
  return axios.delete(`${API_BASE_URL}/users/${userId}`);
};

export const getUserProfile = (userId) => {
  return axios.get(`${API_BASE_URL}/users/${userId}`);
};

export const updateUserProfile = (userId, profileData) => {
  return axios.patch(`${API_BASE_URL}/users/${userId}`, profileData);
};




export const registerUser = (userData) => {
  return axios.post(`${API_BASE_URL}/users`, userData);
};

export const loginUser = async (credentials) => {
  try {
    const users = await axios.get(`${API_BASE_URL}/users`);
    const user = users.data.find(u => u.email === credentials.email && u.password === credentials.password);
    if (user) {
      return { data: { user } };
    } else {
      const error = new Error('Invalid credentials');
      error.response = { data: { error: 'Invalid email or password' } };
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

export const resetPassword = (email) => {
  return axios.post(`${API_BASE_URL}/reset-password`, { email });
};


export const getCarts = () => {
  return axios.get(`${API_BASE_URL}/carts`);
};

export const getCart = (userId) => {
  
  return axios.get(`${API_BASE_URL}/carts?userId=${userId}`);
};

export const createCartItem = (cartData) => {
  return axios.post(`${API_BASE_URL}/carts`, cartData);
};

export const updateCartItem = (cartId, cartData) => {
  return axios.put(`${API_BASE_URL}/carts/${cartId}`, cartData);
};

export const updateCart = (cartId, cartData) => {
  return updateCartItem(cartId, cartData);
};

export const deleteCartItem = (cartId) => {
  return axios.delete(`${API_BASE_URL}/carts/${cartId}`);
};

export const removeFromCart = (cartId) => {
  return deleteCartItem(cartId);
};

export const addToCart = (cartData) => {
  return createCartItem(cartData);
};




export const getOrders = () => {
  return axios.get(`${API_BASE_URL}/orders`);
};

export const createOrder = (orderData) => {
  return axios.post(`${API_BASE_URL}/orders`, orderData);
};

export const getUserOrders = (userId) => {
  return axios.get(`${API_BASE_URL}/users/${userId}`).then(response => {
    return { data: response.data.orders || [] };
  });
};

export const deleteUserOrder = async (userId, orderIndex) => {
  const userResponse = await axios.get(`${API_BASE_URL}/users/${userId}`);
  const user = userResponse.data;

  const updatedOrders = [...(user.orders || [])];
  updatedOrders.splice(orderIndex, 1);


  return axios.put(`${API_BASE_URL}/users/${userId}`, {
    ...user,
    orders: updatedOrders
  });
};

export const updateOrder = (orderId, orderData) => {
  return axios.put(`${API_BASE_URL}/orders/${orderId}`, orderData);
};

export const deleteOrder = (orderId) => {
  return axios.delete(`${API_BASE_URL}/orders/${orderId}`);
};




export const getWishlists = () => {
  return axios.get(`${API_BASE_URL}/wishlists`);
};

export const getWishlistByUserId = (userId) => {
  return axios.get(`${API_BASE_URL}/wishlists?userId=${userId}`);
};

export const getWishlist = (userId) => {
  return getWishlistByUserId(userId);
};

export const createWishlistItem = (wishlistData) => {
  return axios.post(`${API_BASE_URL}/wishlists`, wishlistData);
};

export const deleteWishlistItem = (wishlistId) => {
  return axios.delete(`${API_BASE_URL}/wishlists/${wishlistId}`);
};

export const addToWishlist = (wishlistData) => {
  return createWishlistItem(wishlistData);
};

export const updateWishlist = (wishlistId, wishlistData) => {
  return axios.put(`${API_BASE_URL}/wishlists/${wishlistId}`, wishlistData);
};

export const removeFromWishlist = (wishlistId) => {
  return deleteWishlistItem(wishlistId);
};