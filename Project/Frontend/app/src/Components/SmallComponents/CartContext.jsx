import React, { createContext, useState, useEffect } from 'react';
import api from '../../endpoints/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartQuantity, setCartQuantity] = useState("");
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  const fetchCartQuantity = async () => {
    if (isLoggedIn) {
      try {
        const ordersResponse = await api.get("api/orders/", { params: { paid: false } });
        const ordersData = ordersResponse.data;
        //console.log(ordersData);
        
       // console.log(ordersData[0].order_items.length);
        const test = ordersData[0].order_items.length

        const totalQuantity = ordersData.reduce(
          (sum, order) =>
            sum + order.order_items.reduce(
              (itemSum, item) => itemSum + item.quantity,
              0
            ),
          0
        );
        setCartQuantity(test);
      } catch (error) {
        console.error("Error fetching cart quantity", error);
      }
    } else {
      setCartQuantity(0);
    }
  };

  useEffect(() => {
    fetchCartQuantity();
  }, [isLoggedIn]);

  // Για άμεση ενημέρωση του cart (π.χ. με optimistic update)
  const updateCartQuantity = (newQuantity) => {
    setCartQuantity(newQuantity);
  };

  return (
    <CartContext.Provider value={{ cartQuantity, updateCartQuantity, fetchCartQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
