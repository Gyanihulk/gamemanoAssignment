"use client";

import * as React from "react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { type CartItem, Movie } from "@/types";
import { CartItemActions } from "./update-cart";
import { formatPrice } from "@/lib/format";

interface CartItemProps {
  item: CartItem;
}

export function CartItem({ item }: CartItemProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative h-16 w-16 overflow-hidden rounded">
        <Image
          src={item?.movie?.posterUrl}
          alt={item?.movie?.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          className="absolute object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 self-start text-sm">
        <span className="line-clamp-1">{item.movie?.title}</span>
        <span className="line-clamp-1 text-muted-foreground">
          {formatPrice(item.movie?.price)} x {item.quantity} ={" "}
          {formatPrice(item.movie?.price * item.quantity)}
        </span>
        <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
          {item.movie?.genres}
        </span>
      </div>
      <CartItemActions item={item} />
    </div>
  );
}
