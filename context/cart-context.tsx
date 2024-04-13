"use client";

import { createContext, useContext, useState } from "react";
import { type CartItem, Movie } from "@/types";
import { useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CartContextValue {
  cartItems: CartItem[];
  addToCart: (id: string) => void;
  removeFromCart: (movieId: string) => void;
  updateCartItemQuantity: (movieId: string, quantity: number) => void;
  checkoutCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextValue>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  cartTotal: 0,
  cartCount: 0,
  checkoutCart: () => {},
});

export const useCart = () => {
  return useContext(CartContext);
};

interface Props {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: Props) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [refresh, SetRefresh] = useState<Boolean>(false);
  const router = useRouter();
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch("/api/cart/");
        const cartItems = await response.json();
        setCartItems(cartItems.cartItems);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    };

    fetchProductData();
  }, [refresh]);

  const addToCart = async (movieId: string) => {
    try {
      const response = await axios.put(`/api/cart/addMovie/`, { movieId });
      if (response.status === 200) {
        toast.success("Movie added to Cart");
        SetRefresh(!refresh);
      } else {
        toast.error("Failed to add to  cart");
      }
    } catch {
      toast.error("Something went wrong");
      router.push("/auth/login");
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const response = await axios.delete(`/api/cart/${cartItemId}`);

      if (response.status === 200) {
        setCartItems((prevCartItems) =>
          prevCartItems.filter((item) => item.id !== cartItemId)
        );

        toast.success("Cart item removed successfully");
      } else {
        toast.error("Failed to remove cart item");
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast.error("Error removing cart item");
    }
  };

  const updateCartItemQuantity = async (
    cartItemId: string,
    quantity: number
  ) => {
    try {
      const response = await axios.patch(`/api/cart/${cartItemId}`, {
        quantity,
      });

      if (response.status === 200) {
        const updatedCartItem = response.data;

        setCartItems((prevCartItems) => {
          return prevCartItems.map((item) =>
            item.id === cartItemId ? updatedCartItem : item
          );
        });

        toast.success("Cart item quantity updated successfully");
      } else {
        toast.error("Failed to update cart item quantity");
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      toast.error("Error updating cart item quantity");
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.movie.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const checkoutCart = async () => {
    try {
      const response = await axios.post(`/api/cart/checkout`);
      if (response.status === 200) {
        toast.success("Checkout successful! Order has been created. Redirect to payment page.");
      } else {
        toast.error("Checkout failed. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          if (error.response.data === "Address not found") {
            toast.error(
              "Address not found. Please update your address before checkout."
            );
            router.push("/user/address");
          } else if (error.response.data === "No address selected") {
            toast.error("Please select an address for your order.");
          } else {
            toast.error("Error during checkout. Please try again.");
          }
        }
      } else {
        toast.error("Error during checkout. Please try again.");
      }
    }
  };
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        cartTotal,
        cartCount,
        checkoutCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
