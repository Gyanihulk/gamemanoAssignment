"use client";

import { createContext, useContext, useState } from "react";
import { type CartItem, Movie } from "@/types";
import { useEffect } from "react";
import { toast } from "sonner";
import axios from "axios"; 

interface CartContextValue {
  cartItems: CartItem[];
  addToCart: (id: string) => void;
  removeFromCart: (movieId: string) => void;
  updateCartItemQuantity: (movieId: string, quantity: number) => void;
  cartTotal: number;
  cartCount: number;
  data: Movie[]
}

const CartContext = createContext<CartContextValue>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  cartTotal: 0,
  cartCount: 0,
  data: []
});

export const useCart = () => {
  return useContext(CartContext);
};

interface Props {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: Props) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [data, setData] = useState<Movie[]>([]);
  const [refresh, SetRefresh] = useState<Boolean>(false);
  useEffect(() => {
    // Fetch product data
    const fetchProductData = async () => {
      try {
        const response = await fetch("/api/cart/");
        const cartItems = await response.json();
        console.log(cartItems.cartItems)
        setCartItems(cartItems.cartItems);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    };

    fetchProductData();
  }, [refresh]);

  const addToCart = async (movieId: string) => {
    console.log(movieId)
    try {
      await axios.put(`/api/cart/addMovie/`, { movieId });
      toast.success("Movie added to Cart");
      SetRefresh(!refresh)
    } catch {
      toast.error("Something went wrong");
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      // Send a DELETE request to the server to remove the cart item
      const response = await axios.delete(`/api/cart/${cartItemId}`);
  
      // Check if the server responded with a success status
      if (response.status === 200) {
        // Update local cart state by filtering out the removed item
        setCartItems((prevCartItems) =>
          prevCartItems.filter((item) => item.id !== cartItemId)
        );
  
        toast.success('Cart item removed successfully');
      } else {
        // Handle any other response status codes accordingly
        toast.error('Failed to remove cart item');
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast.error('Error removing cart item');
    }
  };

  const updateCartItemQuantity = async(cartItemId: string, quantity: number) => {
    try {
      // Send a PATCH request to the server to update the cart item quantity
      const response = await axios.patch(`/api/cart/${cartItemId}`, {
        quantity,
      });
  
      // Update local cart state if the server responds successfully
      if (response.status === 200) {
        console.log(response)
        const updatedCartItem = response.data;
  
        // Update the cart item in the local state
        setCartItems((prevCartItems) => {
          return prevCartItems.map((item) =>
            item.id === cartItemId ? updatedCartItem : item
          );
        });
  
        toast.success('Cart item quantity updated successfully');
        
      } else {
        // Handle any other response status codes accordingly
        toast.error('Failed to update cart item quantity');
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      toast.error('Error updating cart item quantity');
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        cartTotal,
        cartCount,
        data
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
