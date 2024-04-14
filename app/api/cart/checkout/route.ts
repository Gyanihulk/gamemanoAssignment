import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CartItem } from "@/types";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the user has an address
    const address = await db.address.findFirst({
      where: { userId: user.id },
    });

    if (!address) {
      return new NextResponse("Address not found", { status: 400 });
    }

    // Get the user's cart with items
    const cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: { cartItems: { include: { movie: true } } },
    });

    if (!cart || cart.cartItems.length === 0) {
      return new NextResponse("Cart is empty", { status: 400 });
    }

    // Create the order
    const order = await db.order.create({
      data: {
        userId: user.id,
        addressId: address.id,
        total: cart.total,
        orderItems: {
          create: cart.cartItems.map((item: CartItem) => ({
            movieId: item.movieId,
            quantity: item.quantity,
            price: item.movie.price,
          })),
        },
      },
    });

    // Clear the cart items after creating the order
    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Optionally, reset the cart total to 0
    await db.cart.update({
      where: { id: cart.id },
      data: { total: 0 },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[CHECKOUT_API]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
