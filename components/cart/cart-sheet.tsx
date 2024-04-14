import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Icons } from "../icons";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useCart } from "@/context/cart-context";
import { CartItem } from "./cart-item";
import { formatPrice } from "@/lib/format";

export default function CartSheet() {
  const { cartItems,cartTotal ,checkoutCart} = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Sheet  >
      
      <SheetTrigger  asChild>
        <Button
          aria-label="Cart"
          variant="outline"
          size="icon"
          className="relative"
        >
          {itemCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -right-2 -top-2 g-6 w-6 h-6 rounded-full p-2"
            >
              {itemCount}
            </Badge>
          )}
          <Icons.shoppingCart className="h-4 w-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle className="flex ">
            Cart {itemCount > 0 && `(${itemCount})`}
            <div className="ml-auto mr-10">

            
           Total: {formatPrice(cartTotal)}
          <Button onClick={checkoutCart} className="ml-3 mr-10" variant="default">Checkout</Button></div>
          </SheetTitle>
        </SheetHeader>
        <Separator />
        {itemCount > 0 && (
          <div className="flex flex-1 flex-col gap-5 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-5 pr-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
