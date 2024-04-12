import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CartItem } from "@/types";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user's cart, including cart items and movie details
    const cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            movie: true,
          },
          orderBy: {
            createdAt: 'desc', 
          },
        },
        
      },
    });

    if (!cart) {
      // If the user does not have a cart, return an empty cart structure
      return NextResponse.json({
        cartItems: [],
        total: 0,
      });
    }

    // Calculate the cart total
    const total = cart.cartItems.reduce(
      (acc:any, item:CartItem) => acc + (item.movie.price || 0) * item.quantity,
      0
    );

    // Return the cart with the calculated total
    return NextResponse.json({
      ...cart,
      total,
    });
  } catch (error) {
    console.error("[GET_CART_API]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
