// import React, { createContext, useContext, useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:4444';
// const CartContext = createContext();

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [wishlist, setWishlist] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
//     if (loggedInUser) {
//       setUserId(loggedInUser.id);
//       loadUserData(loggedInUser.id);
//     }
//   }, []);

//   const refreshUserFromLocalStorage = () => {
//     const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
//     if (loggedInUser) {
//       setUserId(loggedInUser.id);
//       loadUserData(loggedInUser.id);
//     } else {
//       setUserId(null);
//       setCart([]);
//       setWishlist([]);
//       setOrders([]);
//     }
//   };

//   const getCart = async (userId) => axios.get(`${API_BASE_URL}/carts?userId=${userId}`);
//   const getWishlist = async (userId) => axios.get(`${API_BASE_URL}/wishlists?userId=${userId}`);

//   const loadUserData = async (userId) => {
//     try {
//       const cartResponse = await getCart(userId);
//       setCart(cartResponse.data || []);

//       const wishlistResponse = await getWishlist(userId);
//       setWishlist(wishlistResponse.data || []);

//       const userResponse = await axios.get(`${API_BASE_URL}/users/${userId}`);
//       const user = userResponse.data;
//       setOrders(user.orders || []);
//     } catch (error) {
//       console.error('Error loading user data:', error);
//     }
//   };

//   const addToCart = async (product) => {
//     if (!userId) {
//       toast.error('Please login to add items to cart');
//       return;
//     }

//     try {
//       const cartData = { userId, productId: product.id, quantity: 1, product };
//       const serverCartResp = await getCart(userId);
//       const serverCart = serverCartResp.data || [];

//       const existingItem = serverCart.find((item) => item.productId === product.id);

//       if (existingItem) {
//         const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
//         const resp = await axios.put(`${API_BASE_URL}/carts/${existingItem.id}`, updatedItem);
//         setCart((prev) =>
//           prev.map((item) => (item.id === existingItem.id ? resp.data : item))
//         );
//         toast.info(`${product.name} quantity increased!`);
//       } else {
//         const response = await axios.post(`${API_BASE_URL}/carts`, cartData);
//         setCart((prev) => [...prev, response.data]);
//         toast.success(`${product.name} added to cart!`);
//       }
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       toast.error('Failed to add item to cart');
//     }
//   };

//   const removeFromCart = async (id) => {
//     try {
//       await axios.delete(`${API_BASE_URL}/carts/${id}`);
//       const itemToRemove = cart.find((item) => item.id === id);
//       if (itemToRemove) {
//         toast.error(`${itemToRemove.product.name} removed from cart!`);
//       }
//       setCart((prev) => prev.filter((item) => item.id !== id));
//     } catch (error) {
//       console.error('Error removing from cart:', error);
//       toast.error('Failed to remove item from cart');
//     }
//   };

//   const updateQuantity = async (id, quantity) => {
//     if (quantity <= 0) quantity = 1;
//     try {
//       const cartItem = cart.find((item) => item.id === id);
//       if (cartItem) {
//         const updated = { ...cartItem, quantity };
//         await axios.put(`${API_BASE_URL}/carts/${id}`, updated);
//         setCart((prev) => prev.map((item) => (item.id === id ? updated : item)));
//       }
//     } catch (error) {
//       console.error('Error updating cart:', error);
//       toast.error('Failed to update cart');
//     }
//   };

//   const clearCart = () => setCart([]);

//   const getTotalPrice = () =>
//     cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

//   const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

//   const getUniqueItemsCount = () => cart.length;

//   const addToWishlist = async (product) => {
//     if (!userId) {
//       toast.error('Please login to add items to wishlist');
//       return;
//     }

//     try {
//       const wishlistData = { userId, productId: product.id, product };
//       const serverWishlistResp = await getWishlist(userId);
//       const serverWishlist = serverWishlistResp.data || [];
//       const existingWishlistItem = serverWishlist.find(
//         (item) => item.productId === product.id
//       );

//       if (existingWishlistItem) {
//         toast.info(`${product.name} is already in wishlist!`);
//         setWishlist(serverWishlist);
//       } else {
//         const response = await axios.post(`${API_BASE_URL}/wishlists`, wishlistData);
//         setWishlist((prev) => [...prev, response.data]);
//         toast.success(`${product.name} added to wishlist!`);
//       }
//     } catch (error) {
//       console.error('Error adding to wishlist:', error);
//       toast.error('Failed to add item to wishlist');
//     }
//   };

//   const removeFromWishlist = async (id) => {
//     try {
//       await axios.delete(`${API_BASE_URL}/wishlists/${id}`);
//       const itemToRemove = wishlist.find((item) => item.id === id);
//       if (itemToRemove) {
//         toast.error(`${itemToRemove.product.name} removed from wishlist!`);
//       }
//       setWishlist((prev) => prev.filter((item) => item.id !== id));
//     } catch (error) {
//       console.error('Error removing from wishlist:', error);
//       toast.error('Failed to remove item from wishlist');
//     }
//   };

//   const isInWishlist = (productId) =>
//     wishlist.some((item) => item.productId === productId);

//   const getWishlistCount = () => wishlist.length;

//   const placeOrder = async (orderData) => {
//     if (!userId) {
//       toast.error('Please login to place order');
//       return;
//     }

//     try {
//       const order = {
//         userId,
//         items: cart,
//         total: getTotalPrice(),
//         address: orderData.address,
//         date: new Date().toISOString(),
//         status: 'pending',
//       };

//       const userResponse = await axios.get(`${API_BASE_URL}/users/${userId}`);
//       const user = userResponse.data;
//       const updatedOrders = [...(user.orders || []), order];

//       await axios.put(`${API_BASE_URL}/users/${userId}`, {
//         ...user,
//         orders: updatedOrders,
//       });

//       for (const cartItem of cart) {
//         await axios.delete(`${API_BASE_URL}/carts/${cartItem.id}`);
//       }

//       clearCart();
//       await loadUserData(userId);
//       toast.success('Order placed successfully!');
//       return true;
//     } catch (error) {
//       console.error('Error placing order:', error);
//       toast.error('Failed to place order');
//       return false;
//     }
//   };

//   const deleteOrder = async (orderIndex) => {
//     if (!userId) {
//       toast.error('Please login to delete order');
//       return;
//     }

//     try {
//       const userResponse = await axios.get(`${API_BASE_URL}/users/${userId}`);
//       const user = userResponse.data;

//       const updatedOrders = user.orders.filter((_, index) => index !== orderIndex);

//       await axios.put(`${API_BASE_URL}/users/${userId}`, {
//         ...user,
//         orders: updatedOrders,
//       });

//       await loadUserData(userId);
//       toast.success('Order cancelled successfully!');
//     } catch (error) {
//       console.error('Error deleting order:', error);
//       toast.error('Failed to cancel order');
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         refreshUserFromLocalStorage,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         getTotalPrice,
//         getTotalItems,
//         getUniqueItemsCount,
//         wishlist,
//         addToWishlist,
//         removeFromWishlist,
//         isInWishlist,
//         getWishlistCount,
//         orders,
//         placeOrder,
//         deleteOrder,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };


import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../config/api";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);

  // ================= LOAD INITIAL DATA =================
  useEffect(() => {
    loadCart();
    loadWishlist();
    loadOrders();
  }, []);

  const loadCart = async () => {
    try {
      const res = await api.get("/Cart");
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadWishlist = async () => {
    try {
      const res = await api.get("/Wishlist");
      setWishlist(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await api.get("/Order/my-orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CART =================

  const addToCart = async (product) => {
    try {
      await api.post(`/Cart/${product.id}`);
      toast.success(`${product.name} added to cart`);
      loadCart();
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/Cart/${productId}`);
      toast.error("Removed from cart");
      loadCart();
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await api.put("/Cart/update", {
        productId,
        quantity,
      });
      loadCart();
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const getUniqueItemsCount = () => cart.length;

  // ================= WISHLIST =================

  const addToWishlist = async (product) => {
    try {
      await api.post(`/Wishlist/${product.id}`);
      toast.success(`${product.name} added to wishlist`);
      loadWishlist();
    } catch (err) {
      toast.error("Failed to add to wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/Wishlist/${productId}`);
      toast.error("Removed from wishlist");
      loadWishlist();
    } catch (err) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.productId === productId);

  const getWishlistCount = () => wishlist.length;

  // ================= ORDERS =================

  const placeOrderFromCart = async (addressData) => {
    try {
      await api.post("/Order/add-from-cart", addressData);
      toast.success("Order placed successfully");
      loadCart();
      loadOrders();
      return true;
    } catch (err) {
      toast.error("Failed to place order");
      return false;
    }
  };

  const buyNow = async (productId, addressData) => {
    try {
      await api.post("/Order/buy-now", {
        productId,
        ...addressData,
      });
      toast.success("Order placed successfully");
      loadOrders();
      return true;
    } catch (err) {
      toast.error("Failed to place order");
      return false;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await api.patch(`/Order/${orderId}/cancel`);
      toast.success("Order cancelled");
      loadOrders();
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        getUniqueItemsCount,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount,
        placeOrderFromCart,
        buyNow,
        cancelOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};