import { UserRole } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  name: string;
  addresses: Address[];
  cart?: Cart;
  orders: Order[];
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Movie {
  id: string;
  title: string;
  releaseDate: Date;
  posterUrl?: string;
  genres: string[];
  runtime?: number;
  language?: string;
  director?: string;
  writers: string[];
  actors: string[];
  plot?: string;
  imdbRating?: number;
  imdbID?: string;
  originalTitle?: string;
  isAdult?: boolean;
  price?: number;
}

export interface Cart {
  id: string;
  userId: string;
  cartItems: CartItem[];
  total: number;
}

export interface CartItem {
  id: string;
  movieId: string;
  movie: Movie;
  cartId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  address: Address;
  orderItems: OrderItem[];
  total: number;
  status: string;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  movieId: string;
  movie: Movie;
  orderId: string;
  quantity: number;
  price: number;
}
