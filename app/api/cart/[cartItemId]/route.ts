import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CartItem } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { cartItemId: string } }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { quantity } = await req.json();

    if (!quantity || quantity < 1) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const cartItem = await db.cartItem.findFirst({
      where: {
        id: params.cartItemId,
        cart: {
          userId: user.id,
        },
      },
      include: {
        movie: true, // Include the movie details to get the price for recalculation
      },
    });

    if (!cartItem) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Update the quantity of the cart item
    await db.cartItem.update({
      where: { id: params.cartItemId },
      data: { quantity },
    });

    // Recalculate the cart total
    const cartItems = await db.cartItem.findMany({
      where: { cartId: cartItem.cartId },
      include: { movie: true },
    });

    const newTotal = cartItems.reduce((acc:number, item:any) => {
      // Check if the movie property exists and has a price before adding to the total
      return item.movie && item.movie.price ? acc + item.movie.price * item.quantity : acc;
    }, 0);
    

    // Update the cart total
    await db.cart.update({
      where: { id: cartItem.cartId },
      data: { total: newTotal },
    });

    return new NextResponse("Cart item quantity updated successfully", { status: 200 });
  } catch (error) {
    console.error("[UPDATE_CART_ITEM_QUANTITY]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { cartItemId: string } }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cartItem = await db.cartItem.findFirst({
      where: {
        id: params.cartItemId,
        cart: {
          userId: user.id,
        },
      },
      include: {
        movie: true, // Include related movie to get the price
      },
    });

    if (!cartItem) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Store the price and quantity before deletion to adjust the total
    const itemTotal = cartItem.movie.price * cartItem.quantity;

    await db.cartItem.delete({
      where: { id: params.cartItemId },
    });

    // Find the cart that the item was part of
    const cart = await db.cart.findUnique({
      where: { id: cartItem.cartId },
    });

    if (cart) {
      // Update the total of the cart
      await db.cart.update({
        where: { id: cart.id },
        data: { total: cart.total - itemTotal }, // Subtract the item total from the cart total
      });
    }

    return new NextResponse("Cart item deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[DELETE_CART_ITEM]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
